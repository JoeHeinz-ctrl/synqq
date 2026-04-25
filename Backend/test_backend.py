#!/usr/bin/env python3
"""
Backend validation script
Tests if the backend can start without errors
"""

import sys
import os

def test_imports():
    """Test if all imports work correctly"""
    print("🧪 Testing imports...")
    
    try:
        # Test core imports
        from app.routes import auth_routes, project_routes, task_routes
        from app.routes import team_routes, subscription_routes
        print("✅ Core routes imported successfully")
        
        # Test optional AI import
        try:
            from app.routes import ai
            print("✅ AI routes imported successfully")
        except ImportError as e:
            print(f"⚠️ AI routes not available: {e}")
        
        # Test main app import
        from app.main import app
        print("✅ Main app imported successfully")
        
        return True
        
    except Exception as e:
        print(f"❌ Import error: {e}")
        return False

def test_health_endpoint():
    """Test if health endpoint works"""
    print("\n🧪 Testing health endpoint...")
    
    try:
        from app.main import app
        from fastapi.testclient import TestClient
        
        client = TestClient(app)
        response = client.get("/health")
        
        if response.status_code == 200:
            print("✅ Health endpoint working")
            print(f"📊 Response: {response.json()}")
            return True
        else:
            print(f"❌ Health endpoint failed: {response.status_code}")
            return False
            
    except Exception as e:
        print(f"❌ Health endpoint error: {e}")
        return False

def main():
    print("🔧 Backend Validation Test")
    print("=" * 40)
    
    # Test imports
    imports_ok = test_imports()
    
    # Test health endpoint
    health_ok = test_health_endpoint()
    
    print("\n" + "=" * 40)
    if imports_ok and health_ok:
        print("✅ Backend validation PASSED")
        print("🚀 Backend should start successfully")
        sys.exit(0)
    else:
        print("❌ Backend validation FAILED")
        print("🔧 Fix the issues above before deploying")
        sys.exit(1)

if __name__ == "__main__":
    main()