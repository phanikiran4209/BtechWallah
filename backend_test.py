#!/usr/bin/env python3
"""
Backend API Testing Script for Freelance Project Management System
Tests all CRUD operations for clients, projects, invoices, and dashboard stats
"""

import requests
import json
import os
from datetime import datetime, timedelta
from pathlib import Path

# Load environment variables
from dotenv import load_dotenv
load_dotenv(Path(__file__).parent / 'frontend' / '.env')

# Get backend URL from environment
BACKEND_URL = os.environ.get('REACT_APP_BACKEND_URL')
if not BACKEND_URL:
    print("ERROR: REACT_APP_BACKEND_URL not found in environment")
    exit(1)

API_BASE = f"{BACKEND_URL}/api"

class APITester:
    def __init__(self):
        self.session = requests.Session()
        self.created_clients = []
        self.created_projects = []
        self.created_invoices = []
        
    def log(self, message, level="INFO"):
        timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        print(f"[{timestamp}] {level}: {message}")
        
    def test_api_connection(self):
        """Test basic API connectivity"""
        self.log("Testing API connection...")
        try:
            response = self.session.get(f"{API_BASE}/")
            if response.status_code == 200:
                self.log("✅ API connection successful")
                return True
            else:
                self.log(f"❌ API connection failed: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ API connection error: {str(e)}", "ERROR")
            return False
    
    def test_dashboard_empty(self):
        """Test dashboard endpoint with empty database"""
        self.log("Testing dashboard endpoint (empty state)...")
        try:
            response = self.session.get(f"{API_BASE}/dashboard")
            if response.status_code == 200:
                data = response.json()
                self.log(f"✅ Dashboard endpoint working - Stats: {data}")
                return True
            else:
                self.log(f"❌ Dashboard endpoint failed: {response.status_code} - {response.text}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ Dashboard endpoint error: {str(e)}", "ERROR")
            return False
    
    def test_clients_crud(self):
        """Test all client CRUD operations"""
        self.log("Testing Client CRUD operations...")
        
        # Test GET all clients (empty)
        try:
            response = self.session.get(f"{API_BASE}/clients")
            if response.status_code == 200:
                self.log("✅ GET /clients successful")
            else:
                self.log(f"❌ GET /clients failed: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ GET /clients error: {str(e)}", "ERROR")
            return False
        
        # Test CREATE client
        client_data = {
            "name": "Acme Corporation",
            "email": "contact@acme.com",
            "phone": "+1-555-0123",
            "company": "Acme Corp"
        }
        
        try:
            response = self.session.post(f"{API_BASE}/clients", json=client_data)
            if response.status_code == 200:
                client = response.json()
                self.created_clients.append(client['id'])
                self.log(f"✅ POST /clients successful - Created client: {client['id']}")
            else:
                self.log(f"❌ POST /clients failed: {response.status_code} - {response.text}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ POST /clients error: {str(e)}", "ERROR")
            return False
        
        # Create another client for testing
        client_data2 = {
            "name": "TechStart Inc",
            "email": "hello@techstart.io",
            "phone": "+1-555-0456",
            "company": "TechStart"
        }
        
        try:
            response = self.session.post(f"{API_BASE}/clients", json=client_data2)
            if response.status_code == 200:
                client2 = response.json()
                self.created_clients.append(client2['id'])
                self.log(f"✅ POST /clients successful - Created client: {client2['id']}")
            else:
                self.log(f"❌ POST /clients failed: {response.status_code} - {response.text}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ POST /clients error: {str(e)}", "ERROR")
            return False
        
        # Test GET specific client
        client_id = self.created_clients[0]
        try:
            response = self.session.get(f"{API_BASE}/clients/{client_id}")
            if response.status_code == 200:
                self.log(f"✅ GET /clients/{client_id} successful")
            else:
                self.log(f"❌ GET /clients/{client_id} failed: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ GET /clients/{client_id} error: {str(e)}", "ERROR")
            return False
        
        # Test UPDATE client
        update_data = {
            "phone": "+1-555-9999",
            "company": "Acme Corporation Ltd"
        }
        
        try:
            response = self.session.put(f"{API_BASE}/clients/{client_id}", json=update_data)
            if response.status_code == 200:
                self.log(f"✅ PUT /clients/{client_id} successful")
            else:
                self.log(f"❌ PUT /clients/{client_id} failed: {response.status_code} - {response.text}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ PUT /clients/{client_id} error: {str(e)}", "ERROR")
            return False
        
        # Test GET all clients (should have 2 now)
        try:
            response = self.session.get(f"{API_BASE}/clients")
            if response.status_code == 200:
                clients = response.json()
                if len(clients) >= 2:
                    self.log(f"✅ GET /clients successful - Found {len(clients)} clients")
                else:
                    self.log(f"❌ Expected at least 2 clients, found {len(clients)}", "ERROR")
                    return False
            else:
                self.log(f"❌ GET /clients failed: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ GET /clients error: {str(e)}", "ERROR")
            return False
        
        return True
    
    def test_projects_crud(self):
        """Test all project CRUD operations"""
        self.log("Testing Project CRUD operations...")
        
        if not self.created_clients:
            self.log("❌ No clients available for project testing", "ERROR")
            return False
        
        # Test GET all projects (empty)
        try:
            response = self.session.get(f"{API_BASE}/projects")
            if response.status_code == 200:
                self.log("✅ GET /projects successful")
            else:
                self.log(f"❌ GET /projects failed: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ GET /projects error: {str(e)}", "ERROR")
            return False
        
        # Test CREATE project
        project_data = {
            "name": "Website Redesign",
            "client": self.created_clients[0],
            "budget": 15000.00,
            "start_date": "2024-01-15",
            "end_date": "2024-03-15",
            "status": "active",
            "description": "Complete website redesign with modern UI/UX"
        }
        
        try:
            response = self.session.post(f"{API_BASE}/projects", json=project_data)
            if response.status_code == 200:
                project = response.json()
                self.created_projects.append(project['id'])
                self.log(f"✅ POST /projects successful - Created project: {project['id']}")
            else:
                self.log(f"❌ POST /projects failed: {response.status_code} - {response.text}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ POST /projects error: {str(e)}", "ERROR")
            return False
        
        # Create another project
        project_data2 = {
            "name": "Mobile App Development",
            "client": self.created_clients[1] if len(self.created_clients) > 1 else self.created_clients[0],
            "budget": 25000.00,
            "start_date": "2024-02-01",
            "end_date": "2024-06-01",
            "status": "active",
            "description": "Native mobile app for iOS and Android"
        }
        
        try:
            response = self.session.post(f"{API_BASE}/projects", json=project_data2)
            if response.status_code == 200:
                project2 = response.json()
                self.created_projects.append(project2['id'])
                self.log(f"✅ POST /projects successful - Created project: {project2['id']}")
            else:
                self.log(f"❌ POST /projects failed: {response.status_code} - {response.text}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ POST /projects error: {str(e)}", "ERROR")
            return False
        
        # Test GET specific project
        project_id = self.created_projects[0]
        try:
            response = self.session.get(f"{API_BASE}/projects/{project_id}")
            if response.status_code == 200:
                self.log(f"✅ GET /projects/{project_id} successful")
            else:
                self.log(f"❌ GET /projects/{project_id} failed: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ GET /projects/{project_id} error: {str(e)}", "ERROR")
            return False
        
        # Test UPDATE project
        update_data = {
            "budget": 18000.00,
            "status": "on-hold"
        }
        
        try:
            response = self.session.put(f"{API_BASE}/projects/{project_id}", json=update_data)
            if response.status_code == 200:
                self.log(f"✅ PUT /projects/{project_id} successful")
            else:
                self.log(f"❌ PUT /projects/{project_id} failed: {response.status_code} - {response.text}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ PUT /projects/{project_id} error: {str(e)}", "ERROR")
            return False
        
        return True
    
    def test_invoices_crud(self):
        """Test all invoice CRUD operations"""
        self.log("Testing Invoice CRUD operations...")
        
        if not self.created_clients or not self.created_projects:
            self.log("❌ No clients or projects available for invoice testing", "ERROR")
            return False
        
        # Test GET all invoices (empty)
        try:
            response = self.session.get(f"{API_BASE}/invoices")
            if response.status_code == 200:
                self.log("✅ GET /invoices successful")
            else:
                self.log(f"❌ GET /invoices failed: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ GET /invoices error: {str(e)}", "ERROR")
            return False
        
        # Test CREATE invoice
        invoice_data = {
            "client": self.created_clients[0],
            "project": self.created_projects[0],
            "amount": 5000.00,
            "due_date": "2024-02-15",
            "status": "pending",
            "description": "First milestone payment"
        }
        
        try:
            response = self.session.post(f"{API_BASE}/invoices", json=invoice_data)
            if response.status_code == 200:
                invoice = response.json()
                self.created_invoices.append(invoice['id'])
                self.log(f"✅ POST /invoices successful - Created invoice: {invoice['id']}")
            else:
                self.log(f"❌ POST /invoices failed: {response.status_code} - {response.text}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ POST /invoices error: {str(e)}", "ERROR")
            return False
        
        # Create another invoice
        invoice_data2 = {
            "client": self.created_clients[1] if len(self.created_clients) > 1 else self.created_clients[0],
            "project": self.created_projects[1] if len(self.created_projects) > 1 else self.created_projects[0],
            "amount": 8000.00,
            "due_date": "2024-03-01",
            "status": "pending",
            "description": "Second milestone payment"
        }
        
        try:
            response = self.session.post(f"{API_BASE}/invoices", json=invoice_data2)
            if response.status_code == 200:
                invoice2 = response.json()
                self.created_invoices.append(invoice2['id'])
                self.log(f"✅ POST /invoices successful - Created invoice: {invoice2['id']}")
            else:
                self.log(f"❌ POST /invoices failed: {response.status_code} - {response.text}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ POST /invoices error: {str(e)}", "ERROR")
            return False
        
        # Test GET specific invoice
        invoice_id = self.created_invoices[0]
        try:
            response = self.session.get(f"{API_BASE}/invoices/{invoice_id}")
            if response.status_code == 200:
                self.log(f"✅ GET /invoices/{invoice_id} successful")
            else:
                self.log(f"❌ GET /invoices/{invoice_id} failed: {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ GET /invoices/{invoice_id} error: {str(e)}", "ERROR")
            return False
        
        # Test UPDATE invoice
        update_data = {
            "status": "paid",
            "amount": 5500.00
        }
        
        try:
            response = self.session.put(f"{API_BASE}/invoices/{invoice_id}", json=update_data)
            if response.status_code == 200:
                self.log(f"✅ PUT /invoices/{invoice_id} successful")
            else:
                self.log(f"❌ PUT /invoices/{invoice_id} failed: {response.status_code} - {response.text}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ PUT /invoices/{invoice_id} error: {str(e)}", "ERROR")
            return False
        
        return True
    
    def test_dashboard_with_data(self):
        """Test dashboard endpoint with data"""
        self.log("Testing dashboard endpoint (with data)...")
        try:
            response = self.session.get(f"{API_BASE}/dashboard")
            if response.status_code == 200:
                data = response.json()
                self.log(f"✅ Dashboard endpoint working with data")
                self.log(f"   Total clients: {data.get('total_clients', 0)}")
                self.log(f"   Active projects: {data.get('active_projects', 0)}")
                self.log(f"   Total revenue: ${data.get('total_revenue', 0)}")
                self.log(f"   Recent clients: {len(data.get('recent_clients', []))}")
                self.log(f"   Recent projects: {len(data.get('recent_projects', []))}")
                return True
            else:
                self.log(f"❌ Dashboard endpoint failed: {response.status_code} - {response.text}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ Dashboard endpoint error: {str(e)}", "ERROR")
            return False
    
    def test_error_handling(self):
        """Test error handling for invalid IDs"""
        self.log("Testing error handling...")
        
        # Test invalid client ID
        try:
            response = self.session.get(f"{API_BASE}/clients/invalid-id")
            if response.status_code == 404:
                self.log("✅ GET /clients/invalid-id returns 404 as expected")
            else:
                self.log(f"❌ Expected 404 for invalid client ID, got {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ Error testing invalid client ID: {str(e)}", "ERROR")
            return False
        
        # Test invalid project ID
        try:
            response = self.session.get(f"{API_BASE}/projects/invalid-id")
            if response.status_code == 404:
                self.log("✅ GET /projects/invalid-id returns 404 as expected")
            else:
                self.log(f"❌ Expected 404 for invalid project ID, got {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ Error testing invalid project ID: {str(e)}", "ERROR")
            return False
        
        # Test invalid invoice ID
        try:
            response = self.session.get(f"{API_BASE}/invoices/invalid-id")
            if response.status_code == 404:
                self.log("✅ GET /invoices/invalid-id returns 404 as expected")
            else:
                self.log(f"❌ Expected 404 for invalid invoice ID, got {response.status_code}", "ERROR")
                return False
        except Exception as e:
            self.log(f"❌ Error testing invalid invoice ID: {str(e)}", "ERROR")
            return False
        
        return True
    
    def test_delete_operations(self):
        """Test delete operations"""
        self.log("Testing delete operations...")
        
        # Delete one invoice
        if self.created_invoices:
            invoice_id = self.created_invoices[0]
            try:
                response = self.session.delete(f"{API_BASE}/invoices/{invoice_id}")
                if response.status_code == 200:
                    self.log(f"✅ DELETE /invoices/{invoice_id} successful")
                    self.created_invoices.remove(invoice_id)
                else:
                    self.log(f"❌ DELETE /invoices/{invoice_id} failed: {response.status_code}", "ERROR")
                    return False
            except Exception as e:
                self.log(f"❌ DELETE /invoices/{invoice_id} error: {str(e)}", "ERROR")
                return False
        
        # Delete one project
        if self.created_projects:
            project_id = self.created_projects[0]
            try:
                response = self.session.delete(f"{API_BASE}/projects/{project_id}")
                if response.status_code == 200:
                    self.log(f"✅ DELETE /projects/{project_id} successful")
                    self.created_projects.remove(project_id)
                else:
                    self.log(f"❌ DELETE /projects/{project_id} failed: {response.status_code}", "ERROR")
                    return False
            except Exception as e:
                self.log(f"❌ DELETE /projects/{project_id} error: {str(e)}", "ERROR")
                return False
        
        # Delete one client
        if self.created_clients:
            client_id = self.created_clients[0]
            try:
                response = self.session.delete(f"{API_BASE}/clients/{client_id}")
                if response.status_code == 200:
                    self.log(f"✅ DELETE /clients/{client_id} successful")
                    self.created_clients.remove(client_id)
                else:
                    self.log(f"❌ DELETE /clients/{client_id} failed: {response.status_code}", "ERROR")
                    return False
            except Exception as e:
                self.log(f"❌ DELETE /clients/{client_id} error: {str(e)}", "ERROR")
                return False
        
        return True
    
    def run_all_tests(self):
        """Run all tests in sequence"""
        self.log("=" * 60)
        self.log("STARTING BACKEND API TESTS")
        self.log(f"Backend URL: {BACKEND_URL}")
        self.log(f"API Base: {API_BASE}")
        self.log("=" * 60)
        
        tests = [
            ("API Connection", self.test_api_connection),
            ("Dashboard (Empty)", self.test_dashboard_empty),
            ("Client CRUD", self.test_clients_crud),
            ("Project CRUD", self.test_projects_crud),
            ("Invoice CRUD", self.test_invoices_crud),
            ("Dashboard (With Data)", self.test_dashboard_with_data),
            ("Error Handling", self.test_error_handling),
            ("Delete Operations", self.test_delete_operations),
        ]
        
        results = {}
        for test_name, test_func in tests:
            self.log(f"\n--- Running {test_name} ---")
            try:
                results[test_name] = test_func()
            except Exception as e:
                self.log(f"❌ {test_name} failed with exception: {str(e)}", "ERROR")
                results[test_name] = False
        
        # Summary
        self.log("\n" + "=" * 60)
        self.log("TEST RESULTS SUMMARY")
        self.log("=" * 60)
        
        passed = 0
        total = len(results)
        
        for test_name, result in results.items():
            status = "✅ PASS" if result else "❌ FAIL"
            self.log(f"{test_name}: {status}")
            if result:
                passed += 1
        
        self.log(f"\nOverall: {passed}/{total} tests passed")
        
        if passed == total:
            self.log("🎉 ALL TESTS PASSED!")
            return True
        else:
            self.log(f"⚠️  {total - passed} tests failed")
            return False

if __name__ == "__main__":
    tester = APITester()
    success = tester.run_all_tests()
    exit(0 if success else 1)