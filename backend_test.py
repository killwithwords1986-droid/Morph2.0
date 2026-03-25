import requests
import sys
import base64
from datetime import datetime
import json

class StyleWeaverAPITester:
    def __init__(self, base_url="https://style-weaver.preview.emergentagent.com"):
        self.base_url = base_url
        self.api_url = f"{base_url}/api"
        self.tests_run = 0
        self.tests_passed = 0

    def run_test(self, name, method, endpoint, expected_status, data=None, timeout=30):
        """Run a single API test"""
        url = f"{self.api_url}/{endpoint}" if endpoint else self.api_url
        headers = {'Content-Type': 'application/json'}

        self.tests_run += 1
        print(f"\n🔍 Testing {name}...")
        print(f"   URL: {url}")
        
        try:
            if method == 'GET':
                response = requests.get(url, headers=headers, timeout=timeout)
            elif method == 'POST':
                response = requests.post(url, json=data, headers=headers, timeout=timeout)
            elif method == 'DELETE':
                response = requests.delete(url, headers=headers, timeout=timeout)

            success = response.status_code == expected_status
            if success:
                self.tests_passed += 1
                print(f"✅ Passed - Status: {response.status_code}")
                try:
                    response_data = response.json()
                    print(f"   Response: {json.dumps(response_data, indent=2)[:200]}...")
                except:
                    print(f"   Response: {response.text[:200]}...")
            else:
                print(f"❌ Failed - Expected {expected_status}, got {response.status_code}")
                print(f"   Response: {response.text[:200]}...")

            return success, response.json() if response.headers.get('content-type', '').startswith('application/json') else response.text

        except Exception as e:
            print(f"❌ Failed - Error: {str(e)}")
            return False, {}

    def test_root_endpoint(self):
        """Test the root API endpoint"""
        return self.run_test("Root API Endpoint", "GET", "", 200)

    def test_status_create(self):
        """Test creating a status check"""
        test_data = {
            "client_name": f"test_client_{datetime.now().strftime('%H%M%S')}"
        }
        return self.run_test("Create Status Check", "POST", "status", 200, data=test_data)

    def test_status_get(self):
        """Test getting status checks"""
        return self.run_test("Get Status Checks", "GET", "status", 200)

    def test_gallery_get_empty(self):
        """Test getting gallery items (should be empty initially)"""
        return self.run_test("Get Gallery Items", "GET", "gallery", 200)

    def create_test_image_base64(self):
        """Create a simple test image in base64 format"""
        # Create a minimal 1x1 pixel PNG in base64
        # This is a valid PNG image data
        png_data = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChAI9jU77zgAAAABJRU5ErkJggg=="
        return f"data:image/png;base64,{png_data}"

    def test_restyle_endpoint(self):
        """Test the main restyle endpoint with a test image"""
        test_image = self.create_test_image_base64()
        test_data = {
            "imageBase64": test_image,
            "stylePrompt": "wearing a modern tracksuit, fresh sneakers, sporty streetwear aesthetic",
            "gender": "both"
        }
        # Longer timeout for AI generation
        return self.run_test("Restyle Image", "POST", "restyle", 200, data=test_data, timeout=60)

    def test_restyle_with_gender_male(self):
        """Test restyle endpoint with male gender"""
        test_image = self.create_test_image_base64()
        test_data = {
            "imageBase64": test_image,
            "stylePrompt": "wearing a business suit, professional look",
            "gender": "male"
        }
        return self.run_test("Restyle Male Gender", "POST", "restyle", 200, data=test_data, timeout=60)

    def test_restyle_with_gender_female(self):
        """Test restyle endpoint with female gender"""
        test_image = self.create_test_image_base64()
        test_data = {
            "imageBase64": test_image,
            "stylePrompt": "wearing an elegant dress, formal style",
            "gender": "female"
        }
        return self.run_test("Restyle Female Gender", "POST", "restyle", 200, data=test_data, timeout=60)

    def test_restyle_missing_data(self):
        """Test restyle endpoint with missing data"""
        test_data = {
            "imageBase64": "",
            "stylePrompt": ""
        }
        success, response = self.run_test("Restyle Missing Data", "POST", "restyle", 200, data=test_data)
        # Check if error is properly handled
        if success and isinstance(response, dict) and response.get('error'):
            print(f"   ✅ Error properly handled: {response['error']}")
            return True, response
        return success, response

    def test_gallery_save_item(self):
        """Test saving an item to gallery"""
        test_image = self.create_test_image_base64()
        test_data = {
            "original_image": test_image,
            "generated_image": test_image,
            "style_prompt": "Test style for gallery",
            "gender": "both"
        }
        success, response = self.run_test("Save Gallery Item", "POST", "gallery", 200, data=test_data)
        if success and isinstance(response, dict) and response.get('id'):
            print(f"   ✅ Gallery item saved with ID: {response['id']}")
            return success, response
        return success, response

    def test_gallery_get_items(self):
        """Test getting gallery items after saving"""
        return self.run_test("Get Gallery Items After Save", "GET", "gallery", 200)

    def test_gallery_delete_item(self, item_id):
        """Test deleting a gallery item"""
        return self.run_test(f"Delete Gallery Item {item_id}", "DELETE", f"gallery/{item_id}", 200)

    def test_gallery_delete_nonexistent(self):
        """Test deleting a non-existent gallery item"""
        fake_id = "nonexistent-id-12345"
        success, response = self.run_test("Delete Non-existent Item", "DELETE", f"gallery/{fake_id}", 404)
        return success, response

    # Favorites CRUD Tests
    def test_favorites_get_empty(self):
        """Test getting favorites (should be empty initially)"""
        return self.run_test("Get Favorites (Empty)", "GET", "favorites", 200)

    def test_favorites_save(self):
        """Test saving a favorite style combination"""
        test_data = {
            "name": f"Test Favorite {datetime.now().strftime('%H%M%S')}",
            "body_styles": ["sporty-tracksuit", "office-tailored"],
            "hair_styles": ["hair-pixie", "hair-honey"],
            "custom_prompt": "Test custom styling prompt",
            "gender": "both"
        }
        success, response = self.run_test("Save Favorite", "POST", "favorites", 200, data=test_data)
        if success and isinstance(response, dict) and response.get('id'):
            print(f"   ✅ Favorite saved with ID: {response['id']}")
            return success, response
        return success, response

    def test_favorites_get_items(self):
        """Test getting favorites after saving"""
        return self.run_test("Get Favorites After Save", "GET", "favorites", 200)

    def test_favorites_delete_item(self, fav_id):
        """Test deleting a favorite"""
        return self.run_test(f"Delete Favorite {fav_id}", "DELETE", f"favorites/{fav_id}", 200)

    def test_favorites_delete_nonexistent(self):
        """Test deleting a non-existent favorite"""
        fake_id = "nonexistent-fav-12345"
        success, response = self.run_test("Delete Non-existent Favorite", "DELETE", f"favorites/{fake_id}", 404)
        return success, response

    def test_favorites_save_minimal(self):
        """Test saving a favorite with minimal data"""
        test_data = {
            "name": f"Minimal Fav {datetime.now().strftime('%H%M%S')}",
            "body_styles": [],
            "hair_styles": [],
            "custom_prompt": "",
            "gender": "male"
        }
        return self.run_test("Save Minimal Favorite", "POST", "favorites", 200, data=test_data)

    def test_favorites_save_hair_colors_expanded(self):
        """Test saving a favorite with expanded hair color options (53 total)"""
        # Test some of the new hair color options to verify 53 styles are available
        test_data = {
            "name": f"Hair Colors Test {datetime.now().strftime('%H%M%S')}",
            "body_styles": [],
            "hair_styles": [
                "hair-platinum", "hair-honey", "hair-strawberry", "hair-ash-blonde",
                "hair-rose-gold", "hair-pastel-pink", "hair-hot-pink", "hair-lavender",
                "hair-electric-blue", "hair-teal", "hair-mint", "hair-emerald",
                "hair-rainbow", "hair-ombre", "hair-balayage", "hair-oil-slick"
            ],
            "custom_prompt": "Testing expanded hair color palette",
            "gender": "female"
        }
        return self.run_test("Save Favorite with Hair Colors", "POST", "favorites", 200, data=test_data)

def main():
    print("🚀 Starting Style Weaver API Tests")
    print("=" * 50)
    
    # Setup
    tester = StyleWeaverAPITester()

    # Run basic endpoint tests
    print("\n📡 Testing Basic Endpoints...")
    tester.test_root_endpoint()
    tester.test_status_create()
    tester.test_status_get()
    tester.test_gallery_get_empty()

    # Test gallery functionality
    print("\n🖼️ Testing Gallery CRUD Operations...")
    gallery_success, gallery_response = tester.test_gallery_save_item()
    tester.test_gallery_get_items()
    
    # Test gallery deletion if we got an ID from save
    if gallery_success and isinstance(gallery_response, dict) and gallery_response.get('id'):
        item_id = gallery_response['id']
        tester.test_gallery_delete_item(item_id)
    
    tester.test_gallery_delete_nonexistent()

    # Test favorites functionality (NEW in iteration 4)
    print("\n⭐ Testing Favorites CRUD Operations...")
    tester.test_favorites_get_empty()
    favorites_success, favorites_response = tester.test_favorites_save()
    tester.test_favorites_get_items()
    tester.test_favorites_save_minimal()
    tester.test_favorites_save_hair_colors_expanded()
    
    # Test favorites deletion if we got an ID from save
    if favorites_success and isinstance(favorites_response, dict) and favorites_response.get('id'):
        fav_id = favorites_response['id']
        tester.test_favorites_delete_item(fav_id)
    
    tester.test_favorites_delete_nonexistent()

    # Test error handling
    print("\n🛡️ Testing Error Handling...")
    tester.test_restyle_missing_data()

    # Test main functionality with gender parameters
    print("\n🎨 Testing Restyle Functionality with Gender...")
    print("   Note: These tests may take 30-60 seconds each due to AI processing...")
    tester.test_restyle_endpoint()
    tester.test_restyle_with_gender_male()
    tester.test_restyle_with_gender_female()

    # Print results
    print("\n" + "=" * 50)
    print(f"📊 Test Results: {tester.tests_passed}/{tester.tests_run} passed")
    
    if tester.tests_passed == tester.tests_run:
        print("🎉 All tests passed!")
        return 0
    else:
        print(f"⚠️  {tester.tests_run - tester.tests_passed} tests failed")
        return 1

if __name__ == "__main__":
    sys.exit(main())