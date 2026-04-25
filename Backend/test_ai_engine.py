#!/usr/bin/env python3
"""
Simple test script for the AI Engine
"""

import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.services.ai_engine import AIEngine

def test_ai_engine():
    print("🤖 Testing AI Engine...")
    
    ai = AIEngine()
    
    # Test sample tasks
    sample_tasks = [
        {
            'id': 1,
            'title': 'Build login system',
            'status': 'todo',
            'due_date': '2024-04-26T10:00:00'
        },
        {
            'id': 2,
            'title': 'Fix urgent bug',
            'status': 'doing',
            'due_date': '2024-04-25T15:00:00'
        },
        {
            'id': 3,
            'title': 'Write documentation',
            'status': 'todo',
            'due_date': None
        }
    ]
    
    # Test different intents
    test_cases = [
        "Plan my day",
        "Break down build login system",
        "Prioritize my tasks",
        "I'm feeling tired today",
        "Help me focus"
    ]
    
    for message in test_cases:
        print(f"\n📝 Testing: '{message}'")
        try:
            response = ai.process_message(message, sample_tasks)
            print(f"✅ Response type: {response['type']}")
            if response['type'] == 'plan':
                print(f"   📋 Plan has {len(response['data']['tasks'])} tasks")
            elif response['type'] == 'tasks':
                print(f"   🔧 Generated {len(response['data']['subtasks'])} subtasks")
            elif response['type'] == 'priority':
                print(f"   📊 Prioritized {len(response['data']['tasks'])} tasks")
            elif response['type'] == 'chat':
                print(f"   💬 Chat: {response['data']['message'][:50]}...")
        except Exception as e:
            print(f"❌ Error: {e}")
    
    print("\n🎉 AI Engine test completed!")

if __name__ == "__main__":
    test_ai_engine()