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

    def test_generations_get(self):
        """Test getting generations"""
        return self.run_test("Get Generations", "GET", "generations", 200)

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
            "stylePrompt": "wearing a modern tracksuit, fresh sneakers, sporty streetwear aesthetic"
        }
        # Longer timeout for AI generation
        return self.run_test("Restyle Image", "POST", "restyle", 200, data=test_data, timeout=60)

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
    tester.test_generations_get()

    # Test error handling
    print("\n🛡️ Testing Error Handling...")
    tester.test_restyle_missing_data()

    # Test main functionality (this might take longer due to AI processing)
    print("\n🎨 Testing Main Restyle Functionality...")
    print("   Note: This test may take 30-60 seconds due to AI processing...")
    tester.test_restyle_endpoint()

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