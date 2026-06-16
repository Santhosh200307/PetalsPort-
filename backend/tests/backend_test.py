"""PetalsPort backend API tests."""
import os
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://petals-port.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


@pytest.fixture(scope="session")
def client():
    s = requests.Session()
    s.headers.update({"Content-Type": "application/json"})
    return s


# ---------- Status / root ----------
def test_root_status(client):
    r = client.get(f"{API}/")
    assert r.status_code == 200
    data = r.json()
    assert data["app"] == "PetalsPort"
    assert data["status"] == "blooming"


# ---------- Categories ----------
def test_categories_list(client):
    r = client.get(f"{API}/categories")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list) and len(data) == 3
    slugs = {c["slug"] for c in data}
    assert slugs == {"wedding", "birthday", "corporate"}
    for c in data:
        assert "name" in c and "tagline" in c


# ---------- Products ----------
def test_products_list_all(client):
    r = client.get(f"{API}/products")
    assert r.status_code == 200
    data = r.json()
    assert isinstance(data, list) and len(data) >= 9
    p = data[0]
    for k in ("id", "name", "category", "retailPrice", "wholesalePrice", "minWholesale", "unit"):
        assert k in p


def test_products_filter_wedding(client):
    r = client.get(f"{API}/products", params={"category": "wedding"})
    assert r.status_code == 200
    data = r.json()
    assert len(data) >= 1
    assert all(p["category"] == "wedding" for p in data)


def test_products_filter_all_returns_full(client):
    r_all = client.get(f"{API}/products").json()
    r_param_all = client.get(f"{API}/products", params={"category": "all"}).json()
    assert len(r_all) == len(r_param_all)


def test_product_detail_known(client):
    r = client.get(f"{API}/products/rose-red-dutch")
    assert r.status_code == 200
    data = r.json()
    assert data["id"] == "rose-red-dutch"
    assert data["category"] == "wedding"
    assert data["retailPrice"] == 480
    assert data["wholesalePrice"] == 320


def test_product_detail_unknown_404(client):
    r = client.get(f"{API}/products/unknown-xyz")
    assert r.status_code == 404


# ---------- Quote Request ----------
def test_quote_request_create_and_list(client):
    payload = {
        "name": "TEST_Quote User",
        "email": "test_quote@example.com",
        "phone": "+919999999999",
        "company": "TEST Co",
        "event_type": "wedding",
        "event_date": "2026-03-15",
        "location": "Mumbai",
        "guest_count": "200",
        "budget": "100000",
        "notes": "TEST entry from pytest",
    }
    r = client.post(f"{API}/quote-request", json=payload)
    assert r.status_code == 200, r.text
    data = r.json()
    assert data["ok"] is True
    assert "id" in data and isinstance(data["id"], str)
    qid = data["id"]

    r2 = client.get(f"{API}/quote-request")
    assert r2.status_code == 200
    quotes = r2.json()
    assert any(q.get("id") == qid for q in quotes)
    # Validate no _id leaked
    for q in quotes:
        assert "_id" not in q


def test_quote_request_invalid_email(client):
    payload = {
        "name": "X", "email": "not-an-email", "phone": "1",
        "event_type": "wedding", "event_date": "2026-01-01", "location": "X"
    }
    r = client.post(f"{API}/quote-request", json=payload)
    assert r.status_code == 422


# ---------- Contact ----------
def test_contact_create(client):
    payload = {
        "name": "TEST_Contact",
        "email": "test_contact@example.com",
        "subject": "Hello",
        "message": "TEST message from pytest",
    }
    r = client.post(f"{API}/contact", json=payload)
    assert r.status_code == 200
    data = r.json()
    assert data["ok"] is True
    assert "id" in data


# ---------- Newsletter ----------
def test_newsletter_upsert(client):
    email = "test_news@example.com"
    r1 = client.post(f"{API}/newsletter", json={"email": email})
    assert r1.status_code == 200
    assert r1.json()["ok"] is True
    # Upsert: posting again should also succeed
    r2 = client.post(f"{API}/newsletter", json={"email": email})
    assert r2.status_code == 200


def test_newsletter_invalid_email(client):
    r = client.post(f"{API}/newsletter", json={"email": "bad"})
    assert r.status_code == 422
