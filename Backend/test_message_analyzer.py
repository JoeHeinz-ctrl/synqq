"""
Test script for SYNQ AI Message Analyzer
Run this to verify task detection is working correctly
"""
from app.services.message_analyzer import MessageAnalyzer

# Sample team members
team_members = [
    {"id": 1, "name": "Joe Smith", "email": "joe@example.com"},
    {"id": 2, "name": "Sarah Johnson", "email": "sarah@example.com"},
    {"id": 3, "name": "Mike Chen", "email": "mike@example.com"},
]

# Test cases
test_messages = [
    # Basic action verbs
    ("fix the login bug", True, "Fix the login bug"),
    ("deploy the backend", True, "Deploy the backend"),
    ("update API docs", True, "Update API docs"),
    
    # Task indicators
    ("todo: review the PR", True, "Review the PR"),
    ("task: implement feature", True, "Implement feature"),
    ("we should test this", True, "We should test this"),
    
    # With mentions
    ("@Joe fix the bug", True, "Fix the bug"),
    ("@Sarah please review", True, "Please review"),
    
    # With deadlines
    ("deploy today", True, "Deploy"),
    ("fix by tomorrow", True, "Fix by"),
    ("urgent: update docs", True, "Update docs"),
    
    # Complete examples
    ("@Joe fix the login bug tomorrow", True, "Fix the login bug"),
    ("create task deploy backend", True, "Deploy backend"),
    
    # Should NOT detect
    ("hello everyone", False, None),
    ("how are you?", False, None),
    ("thanks!", False, None),
    ("lol", False, None),
]

def run_tests():
    print("🧪 Testing SYNQ AI Message Analyzer\n")
    print("=" * 60)
    
    passed = 0
    failed = 0
    
    for message, should_detect, expected_title in test_messages:
        result = MessageAnalyzer.analyze_message(message, team_members)
        is_task = result.get("isTask", False)
        title = result.get("title", "")
        
        # Check if detection matches expectation
        if is_task == should_detect:
            status = "✅ PASS"
            passed += 1
        else:
            status = "❌ FAIL"
            failed += 1
        
        print(f"\n{status}")
        print(f"Message: '{message}'")
        print(f"Expected: {'Task' if should_detect else 'Not a task'}")
        print(f"Got: {'Task' if is_task else 'Not a task'}")
        
        if is_task:
            print(f"Title: '{title}'")
            if result.get("assignee"):
                print(f"Assignee: {result['assignee']['name']}")
            if result.get("dueDate"):
                print(f"Due Date: {result['dueDate']}")
            print(f"Confidence: {result.get('confidence', 0):.2f}")
    
    print("\n" + "=" * 60)
    print(f"\n📊 Results: {passed} passed, {failed} failed")
    
    if failed == 0:
        print("🎉 All tests passed!")
    else:
        print(f"⚠️  {failed} test(s) failed")
    
    return failed == 0

if __name__ == "__main__":
    success = run_tests()
    exit(0 if success else 1)
