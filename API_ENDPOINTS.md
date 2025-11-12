# SPOT-Q API Endpoints Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
All endpoints except `/auth/login` require a Bearer token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

---

## 1. AUTHENTICATION ENDPOINTS (`/api/auth`)

### 1.1 Login (Public)
- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Headers:** `Content-Type: application/json`
- **Body:**
```json
{
  "employeeId": "EMP001",
  "password": "password123"
}
```
- **Response:**
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "employeeId": "EMP001",
    "name": "John Doe",
    "department": "Process",
    "role": "employee"
  }
}
```

### 1.2 Verify Token (Protected)
- **Method:** `GET`
- **URL:** `/api/auth/verify`
- **Headers:** `Authorization: Bearer <token>`

### 1.3 Change Password (Protected - All Users)
- **Method:** `PUT`
- **URL:** `/api/auth/changepassword`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

---

## 2. ADMIN ENDPOINTS (`/api/auth/admin`)

### 2.1 Get All Departments (Admin Only)
- **Method:** `GET`
- **URL:** `/api/auth/admin/departments`
- **Headers:** `Authorization: Bearer <admin-token>`

### 2.2 Get All Users (Admin Only)
- **Method:** `GET`
- **URL:** `/api/auth/admin/users`
- **Headers:** `Authorization: Bearer <admin-token>`

### 2.3 Create Employee (Admin Only)
- **Method:** `POST`
- **URL:** `/api/auth/admin/users`
- **Headers:** `Authorization: Bearer <admin-token>`
- **Body:**
```json
{
  "employeeId": "EMP002",
  "name": "Jane Smith",
  "password": "password123",
  "department": "Process"
}
```

### 2.4 Update Employee (Admin Only)
- **Method:** `PUT`
- **URL:** `/api/auth/admin/users/:id`
- **Headers:** `Authorization: Bearer <admin-token>`
- **Body:**
```json
{
  "name": "Updated Name",
  "password": "newpassword123",
  "department": "Tensile"
}
```

### 2.5 Delete Employee (Admin Only)
- **Method:** `DELETE`
- **URL:** `/api/auth/admin/users/:id`
- **Headers:** `Authorization: Bearer <admin-token>`

---

## 3. PROCESS CONTROL ENDPOINTS (`/api/v1/process-records`)

### 3.1 Get All Process Records
- **Method:** `GET`
- **URL:** `/api/v1/process-records`
- **Headers:** `Authorization: Bearer <token>`

### 3.2 Create Process Record
- **Method:** `POST`
- **URL:** `/api/v1/process-records`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "date": "2024-01-15",
  "disa": "DISA001",
  "partName": "Part ABC",
  "datecode": "DC001",
  "heatcode": "HC001",
  "quantityOfMoulds": "100",
  "metalCompositionC": "3.5",
  "metalCompositionSi": "2.1",
  "remarks": "Test remarks"
}
```

### 3.3 Create Primary Entry (Process)
- **Method:** `POST`
- **URL:** `/api/v1/process-records/primary`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "date": "2024-01-15",
  "disa": "DISA001"
}
```

### 3.4 Update Process Record
- **Method:** `PUT`
- **URL:** `/api/v1/process-records/:id`
- **Headers:** `Authorization: Bearer <token>`
- **Body:** (Same as create, with updated values)

### 3.5 Delete Process Record
- **Method:** `DELETE`
- **URL:** `/api/v1/process-records/:id`
- **Headers:** `Authorization: Bearer <token>`

---

## 4. MICRO TENSILE TEST ENDPOINTS (`/api/v1/micro-tensile-tests`)

### 4.1 Get All Micro Tensile Tests
- **Method:** `GET`
- **URL:** `/api/v1/micro-tensile-tests`
- **Headers:** `Authorization: Bearer <token>`

### 4.2 Create Micro Tensile Test
- **Method:** `POST`
- **URL:** `/api/v1/micro-tensile-tests`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "date": "2024-01-15",
  "partName": "Part ABC",
  "specimenNo": "SP001",
  "maxLoad": "1000",
  "yieldLoad": "800",
  "tensileStrength": "500",
  "yieldStrength": "400",
  "elongation": "18.5",
  "remarks": "Test remarks",
  "testedBy": "John Doe"
}
```

### 4.3 Update Micro Tensile Test
- **Method:** `PUT`
- **URL:** `/api/v1/micro-tensile-tests/:id`
- **Headers:** `Authorization: Bearer <token>`

### 4.4 Delete Micro Tensile Test
- **Method:** `DELETE`
- **URL:** `/api/v1/micro-tensile-tests/:id`
- **Headers:** `Authorization: Bearer <token>`

---

## 5. TENSILE TEST ENDPOINTS (`/api/v1/tensile-tests`)

### 5.1 Get All Tensile Tests
- **Method:** `GET`
- **URL:** `/api/v1/tensile-tests`
- **Headers:** `Authorization: Bearer <token>`

### 5.2 Create Tensile Test
- **Method:** `POST`
- **URL:** `/api/v1/tensile-tests`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "date": "2024-01-15",
  "partName": "Part ABC",
  "specimenNo": "SP001",
  "breakingLoad": "1200",
  "yieldLoad": "1000",
  "uts": "600",
  "ys": "500",
  "elongation": "20.5",
  "remarks": "Test remarks",
  "testedBy": "John Doe"
}
```

### 5.3 Update Tensile Test
- **Method:** `PUT`
- **URL:** `/api/v1/tensile-tests/:id`
- **Headers:** `Authorization: Bearer <token>`

### 5.4 Delete Tensile Test
- **Method:** `DELETE`
- **URL:** `/api/v1/tensile-tests/:id`
- **Headers:** `Authorization: Bearer <token>`

---

## 6. IMPACT TEST ENDPOINTS (`/api/v1/impact-tests`)

### 6.1 Get All Impact Tests
- **Method:** `GET`
- **URL:** `/api/v1/impact-tests`
- **Headers:** `Authorization: Bearer <token>`

### 6.2 Create Impact Test
- **Method:** `POST`
- **URL:** `/api/v1/impact-tests`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "date": "2024-01-15",
  "partName": "Part ABC",
  "specification": "ISO 148",
  "observedValue": "92,96",
  "remarks": "Test remarks"
}
```

### 6.3 Update Impact Test
- **Method:** `PUT`
- **URL:** `/api/v1/impact-tests/:id`
- **Headers:** `Authorization: Bearer <token>`

### 6.4 Delete Impact Test
- **Method:** `DELETE`
- **URL:** `/api/v1/impact-tests/:id`
- **Headers:** `Authorization: Bearer <token>`

---

## 7. MICRO STRUCTURE ENDPOINTS (`/api/v1/micro-structure`)

### 7.1 Get All Micro Structure Tests
- **Method:** `GET`
- **URL:** `/api/v1/micro-structure`
- **Headers:** `Authorization: Bearer <token>`

### 7.2 Create Micro Structure Test
- **Method:** `POST`
- **URL:** `/api/v1/micro-structure`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "date": "2024-01-15",
  "partName": "Part ABC",
  "graphiteType": "Type A",
  "nodularity": "85",
  "noduleCount": "150",
  "carbidePercent": "2.5",
  "ferritePercent": "15",
  "pearlitePercent": "82.5",
  "remarks": "Test remarks"
}
```

### 7.3 Update Micro Structure Test
- **Method:** `PUT`
- **URL:** `/api/v1/micro-structure/:id`
- **Headers:** `Authorization: Bearer <token>`

### 7.4 Delete Micro Structure Test
- **Method:** `DELETE`
- **URL:** `/api/v1/micro-structure/:id`
- **Headers:** `Authorization: Bearer <token>`

---

## 8. QC PRODUCTION ENDPOINTS (`/api/v1/qc-reports`)

### 8.1 Get All QC Reports
- **Method:** `GET`
- **URL:** `/api/v1/qc-reports`
- **Headers:** `Authorization: Bearer <token>`

### 8.2 Create QC Report
- **Method:** `POST`
- **URL:** `/api/v1/qc-reports`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "date": "2024-01-15",
  "shift": "A",
  "partName": "Part ABC",
  "quantity": "100",
  "remarks": "Test remarks"
}
```

### 8.3 Update QC Report
- **Method:** `PUT`
- **URL:** `/api/v1/qc-reports/:id`
- **Headers:** `Authorization: Bearer <token>`

### 8.4 Delete QC Report
- **Method:** `DELETE`
- **URL:** `/api/v1/qc-reports/:id`
- **Headers:** `Authorization: Bearer <token>`

---

## 9. MOULDING - DISAMATIC PRODUCT REPORT ENDPOINTS (`/api/v1/dismatic-reports`)

### 9.1 Get All Disamatic Reports
- **Method:** `GET`
- **URL:** `/api/v1/dismatic-reports`
- **Headers:** `Authorization: Bearer <token>`

### 9.2 Get Reports by Date Range
- **Method:** `GET`
- **URL:** `/api/v1/dismatic-reports/range?startDate=2024-01-01&endDate=2024-01-31`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `startDate`: YYYY-MM-DD format
  - `endDate`: YYYY-MM-DD format

### 9.3 Get Report by Date
- **Method:** `GET`
- **URL:** `/api/v1/dismatic-reports/date?date=2024-01-15`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `date`: YYYY-MM-DD format

### 9.4 Get Report by ID
- **Method:** `GET`
- **URL:** `/api/v1/dismatic-reports/:id`
- **Headers:** `Authorization: Bearer <token>`

### 9.5 Create Disamatic Report
- **Method:** `POST`
- **URL:** `/api/v1/dismatic-reports`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "date": "2024-01-15",
  "shift": "A",
  "section": "basicInfo",
  "incharge": "John Doe",
  "ppOperator": "Jane Smith",
  "members": ["Member1", "Member2"],
  "productionTable": [...],
  "nextShiftPlanTable": [...],
  "delaysTable": [...],
  "mouldHardnessTable": [...],
  "patternTempTable": [...],
  "significantEvent": "Event description",
  "maintenance": "Maintenance notes",
  "supervisorName": "Supervisor Name"
}
```

### 9.6 Update Disamatic Report
- **Method:** `PUT`
- **URL:** `/api/v1/dismatic-reports/:id`
- **Headers:** `Authorization: Bearer <token>`

### 9.7 Delete Disamatic Report
- **Method:** `DELETE`
- **URL:** `/api/v1/dismatic-reports/:id`
- **Headers:** `Authorization: Bearer <token>`

---

## 10. MOULDING - DMM SETTING PARAMETERS ENDPOINTS (`/api/v1/dmm-settings`)

### 10.1 Get All DMM Settings
- **Method:** `GET`
- **URL:** `/api/v1/dmm-settings`
- **Headers:** `Authorization: Bearer <token>`

### 10.2 Get Settings by Date Range
- **Method:** `GET`
- **URL:** `/api/v1/dmm-settings/range?startDate=2024-01-01&endDate=2024-01-31`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `startDate`: YYYY-MM-DD format
  - `endDate`: YYYY-MM-DD format

### 10.3 Get Settings by Machine
- **Method:** `GET`
- **URL:** `/api/v1/dmm-settings/machine?machine=Machine1`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `machine`: Machine name

### 10.4 Get Settings by Shift
- **Method:** `GET`
- **URL:** `/api/v1/dmm-settings/shift?shift=A`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `shift`: Shift value (A, B, C)

### 10.5 Get Settings by Customer
- **Method:** `GET`
- **URL:** `/api/v1/dmm-settings/customer?customer=Customer1`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `customer`: Customer name

### 10.6 Get Settings by Primary (Date + Machine)
- **Method:** `GET`
- **URL:** `/api/v1/dmm-settings/primary?date=2024-01-15&machine=Machine1`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `date`: YYYY-MM-DD format
  - `machine`: Machine name

### 10.7 Get Settings by ID
- **Method:** `GET`
- **URL:** `/api/v1/dmm-settings/:id`
- **Headers:** `Authorization: Bearer <token>`

### 10.8 Create DMM Settings
- **Method:** `POST`
- **URL:** `/api/v1/dmm-settings`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "date": "2024-01-15",
  "machine": "Machine1",
  "shift": "A",
  "customer": "Customer1",
  "operation": "Operation1",
  "parameters": {
    "pressure": "800",
    "clampingForce": "55",
    "remarks": "Test remarks"
  }
}
```

### 10.9 Update DMM Settings
- **Method:** `PUT`
- **URL:** `/api/v1/dmm-settings/:id`
- **Headers:** `Authorization: Bearer <token>`

### 10.10 Delete DMM Settings
- **Method:** `DELETE`
- **URL:** `/api/v1/dmm-settings/:id`
- **Headers:** `Authorization: Bearer <token>`

---

## 11. MELTING - MELTING LOG SHEET ENDPOINTS (`/api/v1/melting-logs`)

### 11.1 Get All Melting Logs
- **Method:** `GET`
- **URL:** `/api/v1/melting-logs`
- **Headers:** `Authorization: Bearer <token>`

### 11.2 Get Melting Logs by Date Range (Query Parameters)
- **Method:** `GET`
- **URL:** `/api/v1/melting-logs?startDate=2024-01-01&endDate=2024-01-31`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `startDate`: YYYY-MM-DD format (optional)
  - `endDate`: YYYY-MM-DD format (optional)

### 11.3 Get Primary by Date
- **Method:** `GET`
- **URL:** `/api/v1/melting-logs/primary/:date`
- **Headers:** `Authorization: Bearer <token>`
- **URL Parameters:**
  - `date`: YYYY-MM-DD format

### 11.4 Create/Update Primary
- **Method:** `POST`
- **URL:** `/api/v1/melting-logs/primary`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "date": "2024-01-15",
  "shift": "A"
}
```

### 11.5 Create Table Entry (Table 1)
- **Method:** `POST`
- **URL:** `/api/v1/melting-logs/table1`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "date": "2024-01-15",
  "tableData": [...]
}
```

### 11.6 Create Table Entry (Table 2)
- **Method:** `POST`
- **URL:** `/api/v1/melting-logs/table2`
- **Headers:** `Authorization: Bearer <token>`

### 11.7 Create Table Entry (Table 3)
- **Method:** `POST`
- **URL:** `/api/v1/melting-logs/table3`
- **Headers:** `Authorization: Bearer <token>`

### 11.8 Create Table Entry (Table 4)
- **Method:** `POST`
- **URL:** `/api/v1/melting-logs/table4`
- **Headers:** `Authorization: Bearer <token>`

### 11.9 Create Table Entry (Table 5)
- **Method:** `POST`
- **URL:** `/api/v1/melting-logs/table5`
- **Headers:** `Authorization: Bearer <token>`

### 11.10 Create Melting Log Entry
- **Method:** `POST`
- **URL:** `/api/v1/melting-logs`
- **Headers:** `Authorization: Bearer <token>`

### 11.11 Update Melting Log
- **Method:** `PUT`
- **URL:** `/api/v1/melting-logs/:id`
- **Headers:** `Authorization: Bearer <token>`

### 11.12 Delete Melting Log
- **Method:** `DELETE`
- **URL:** `/api/v1/melting-logs/:id`
- **Headers:** `Authorization: Bearer <token>`

---

## 12. MELTING - CUPOLA HOLDER LOG ENDPOINTS (`/api/v1/cupola-holder-logs`)

### 12.1 Get All Cupola Holder Logs
- **Method:** `GET`
- **URL:** `/api/v1/cupola-holder-logs`
- **Headers:** `Authorization: Bearer <token>`

### 12.2 Get Cupola Holder Logs by Date Range (Query Parameters)
- **Method:** `GET`
- **URL:** `/api/v1/cupola-holder-logs?startDate=2024-01-01&endDate=2024-01-31`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `startDate`: YYYY-MM-DD format (optional)
  - `endDate`: YYYY-MM-DD format (optional)

### 12.3 Get Primary by Date, Shift, and Holder Number
- **Method:** `GET`
- **URL:** `/api/v1/cupola-holder-logs/primary/:date/:shift/:holderNumber`
- **Headers:** `Authorization: Bearer <token>`
- **URL Parameters:**
  - `date`: YYYY-MM-DD format
  - `shift`: Shift value (A, B, C)
  - `holderNumber`: Holder number

### 12.4 Create Primary Entry
- **Method:** `POST`
- **URL:** `/api/v1/cupola-holder-logs/primary`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "date": "2024-01-15",
  "shift": "A",
  "holderNumber": "H001"
}
```

### 12.5 Create Cupola Holder Log Entry
- **Method:** `POST`
- **URL:** `/api/v1/cupola-holder-logs`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "date": "2024-01-15",
  "shift": "A",
  "holderNumber": "H001",
  "tap": "Tap1",
  "kw": "100",
  "remarks": "Test remarks"
}
```

### 12.6 Update Cupola Holder Log
- **Method:** `PUT`
- **URL:** `/api/v1/cupola-holder-logs/:id`
- **Headers:** `Authorization: Bearer <token>`

### 12.7 Delete Cupola Holder Log
- **Method:** `DELETE`
- **URL:** `/api/v1/cupola-holder-logs/:id`
- **Headers:** `Authorization: Bearer <token>`

---

## 13. SAND LAB - SAND TESTING RECORD ENDPOINTS (`/api/v1/sand-testing-records`)

### 13.1 Get All Sand Testing Records
- **Method:** `GET`
- **URL:** `/api/v1/sand-testing-records`
- **Headers:** `Authorization: Bearer <token>`

### 13.2 Get Records by Date
- **Method:** `GET`
- **URL:** `/api/v1/sand-testing-records/date/:date`
- **Headers:** `Authorization: Bearer <token>`
- **URL Parameters:**
  - `date`: YYYY-MM-DD format

### 13.3 Get Stats
- **Method:** `GET`
- **URL:** `/api/v1/sand-testing-records/stats`
- **Headers:** `Authorization: Bearer <token>`

### 13.4 Create Primary Entry
- **Method:** `POST`
- **URL:** `/api/v1/sand-testing-records/primary`
- **Headers:** `Authorization: Bearer <token>`

### 13.5 Create Table Entry (Table 1)
- **Method:** `POST`
- **URL:** `/api/v1/sand-testing-records/table1`
- **Headers:** `Authorization: Bearer <token>`

### 13.6 Create Table Entry (Table 2)
- **Method:** `POST`
- **URL:** `/api/v1/sand-testing-records/table2`
- **Headers:** `Authorization: Bearer <token>`

### 13.7 Create Table Entry (Table 3)
- **Method:** `POST`
- **URL:** `/api/v1/sand-testing-records/table3`
- **Headers:** `Authorization: Bearer <token>`

### 13.8 Create Table Entry (Table 4)
- **Method:** `POST`
- **URL:** `/api/v1/sand-testing-records/table4`
- **Headers:** `Authorization: Bearer <token>`

### 13.9 Create Table Entry (Table 5)
- **Method:** `POST`
- **URL:** `/api/v1/sand-testing-records/table5`
- **Headers:** `Authorization: Bearer <token>`

### 13.10 Create Sand Testing Record
- **Method:** `POST`
- **URL:** `/api/v1/sand-testing-records`
- **Headers:** `Authorization: Bearer <token>`

### 13.11 Get Record by ID
- **Method:** `GET`
- **URL:** `/api/v1/sand-testing-records/:id`
- **Headers:** `Authorization: Bearer <token>`

### 13.12 Update Sand Testing Record
- **Method:** `PUT`
- **URL:** `/api/v1/sand-testing-records/:id`
- **Headers:** `Authorization: Bearer <token>`

### 13.13 Patch Sand Testing Record
- **Method:** `PATCH`
- **URL:** `/api/v1/sand-testing-records/:id`
- **Headers:** `Authorization: Bearer <token>`

### 13.14 Delete Sand Testing Record
- **Method:** `DELETE`
- **URL:** `/api/v1/sand-testing-records/:id`
- **Headers:** `Authorization: Bearer <token>`

### 13.15 Bulk Delete Sand Testing Records
- **Method:** `DELETE`
- **URL:** `/api/v1/sand-testing-records/bulk`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "ids": ["id1", "id2", "id3"]
}
```

---

## 14. SAND LAB - FOUNDRY SAND TESTING NOTE ENDPOINTS (`/api/v1/foundry-sand-testing-notes`)

### 14.1 Get All Foundry Sand Testing Notes
- **Method:** `GET`
- **URL:** `/api/v1/foundry-sand-testing-notes`
- **Headers:** `Authorization: Bearer <token>`

### 14.2 Get Notes by Date Range (Query Parameters)
- **Method:** `GET`
- **URL:** `/api/v1/foundry-sand-testing-notes?startDate=2024-01-01&endDate=2024-01-31`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `startDate`: YYYY-MM-DD format (optional)
  - `endDate`: YYYY-MM-DD format (optional)

### 14.3 Get Entry by Primary
- **Method:** `GET`
- **URL:** `/api/v1/foundry-sand-testing-notes/primary`
- **Headers:** `Authorization: Bearer <token>`
- **Query Parameters:**
  - `date`: YYYY-MM-DD format
  - (Other primary fields as needed)

### 14.4 Create Foundry Sand Testing Note
- **Method:** `POST`
- **URL:** `/api/v1/foundry-sand-testing-notes`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
```json
{
  "date": "2024-01-15",
  "section": "basicInfo",
  "data": {
    "field1": "value1",
    "field2": "value2"
  }
}
```

### 14.5 Update Foundry Sand Testing Note
- **Method:** `PUT`
- **URL:** `/api/v1/foundry-sand-testing-notes/:id`
- **Headers:** `Authorization: Bearer <token>`

### 14.6 Delete Foundry Sand Testing Note
- **Method:** `DELETE`
- **URL:** `/api/v1/foundry-sand-testing-notes/:id`
- **Headers:** `Authorization: Bearer <token>`

---

## 15. HEALTH CHECK ENDPOINT

### 15.1 Health Check (Public)
- **Method:** `GET`
- **URL:** `/api/health`
- **Headers:** None required
- **Response:**
```json
{
  "status": "ok",
  "mongodb": "connected",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## TESTING ORDER IN POSTMAN

### Step 1: Authentication
1. **Login** - `POST /api/auth/login`
   - Save the `token` from response for subsequent requests

### Step 2: Verify Token
2. **Verify Token** - `GET /api/auth/verify`
   - Use the token from Step 1 in Authorization header

### Step 3: Admin Operations (If Admin User)
3. **Get Departments** - `GET /api/auth/admin/departments`
4. **Get All Users** - `GET /api/auth/admin/users`
5. **Create Employee** - `POST /api/auth/admin/users`
6. **Update Employee** - `PUT /api/auth/admin/users/:id`
7. **Delete Employee** - `DELETE /api/auth/admin/users/:id`

### Step 4: Process Control
8. **Create Process Record** - `POST /api/v1/process-records`
9. **Get All Process Records** - `GET /api/v1/process-records`
10. **Update Process Record** - `PUT /api/v1/process-records/:id`
11. **Delete Process Record** - `DELETE /api/v1/process-records/:id`

### Step 5: QC Testing Endpoints
12. **Create Micro Tensile Test** - `POST /api/v1/micro-tensile-tests`
13. **Get All Micro Tensile Tests** - `GET /api/v1/micro-tensile-tests`
14. **Create Tensile Test** - `POST /api/v1/tensile-tests`
15. **Get All Tensile Tests** - `GET /api/v1/tensile-tests`
16. **Create Impact Test** - `POST /api/v1/impact-tests`
17. **Get All Impact Tests** - `GET /api/v1/impact-tests`
18. **Create Micro Structure Test** - `POST /api/v1/micro-structure`
19. **Get All Micro Structure Tests** - `GET /api/v1/micro-structure`
20. **Create QC Report** - `POST /api/v1/qc-reports`
21. **Get All QC Reports** - `GET /api/v1/qc-reports`

### Step 6: Moulding Endpoints
22. **Create DMM Settings** - `POST /api/v1/dmm-settings`
23. **Get DMM Settings by Primary** - `GET /api/v1/dmm-settings/primary?date=2024-01-15&machine=Machine1`
24. **Get All DMM Settings** - `GET /api/v1/dmm-settings`
25. **Create Disamatic Report** - `POST /api/v1/dismatic-reports`
26. **Get Disamatic Report by Date** - `GET /api/v1/dismatic-reports/date?date=2024-01-15`
27. **Get Disamatic Reports by Date Range** - `GET /api/v1/dismatic-reports/range?startDate=2024-01-01&endDate=2024-01-31`

### Step 7: Melting Endpoints
28. **Create Melting Log Primary** - `POST /api/v1/melting-logs/primary`
29. **Get Melting Log Primary by Date** - `GET /api/v1/melting-logs/primary/2024-01-15`
30. **Create Melting Log Table Entry** - `POST /api/v1/melting-logs/table1`
31. **Get Melting Logs by Date Range** - `GET /api/v1/melting-logs?startDate=2024-01-01&endDate=2024-01-31`
32. **Create Cupola Holder Log Primary** - `POST /api/v1/cupola-holder-logs/primary`
33. **Get Cupola Holder Log Primary** - `GET /api/v1/cupola-holder-logs/primary/2024-01-15/A/H001`
34. **Create Cupola Holder Log** - `POST /api/v1/cupola-holder-logs`
35. **Get Cupola Holder Logs by Date Range** - `GET /api/v1/cupola-holder-logs?startDate=2024-01-01&endDate=2024-01-31`

### Step 8: Sand Lab Endpoints
36. **Create Sand Testing Record Primary** - `POST /api/v1/sand-testing-records/primary`
37. **Create Sand Testing Record Table Entry** - `POST /api/v1/sand-testing-records/table1`
38. **Get Sand Testing Records by Date** - `GET /api/v1/sand-testing-records/date/2024-01-15`
39. **Get All Sand Testing Records** - `GET /api/v1/sand-testing-records`
40. **Create Foundry Sand Testing Note** - `POST /api/v1/foundry-sand-testing-notes`
41. **Get Foundry Sand Testing Notes by Date Range** - `GET /api/v1/foundry-sand-testing-notes?startDate=2024-01-01&endDate=2024-01-31`

### Step 9: Update and Delete Operations
42. **Update entries** - Use `PUT` method with `/:id` endpoints
43. **Delete entries** - Use `DELETE` method with `/:id` endpoints

### Step 10: Change Password
44. **Change Password** - `PUT /api/auth/changepassword`

---

## NOTES

1. **Authentication**: All endpoints except `/api/auth/login` and `/api/health` require Bearer token authentication.

2. **Department Access**: Users can only access endpoints related to their department. Admin users and users with "All" department have access to all endpoints.

3. **Date Format**: All dates should be in `YYYY-MM-DD` format (e.g., "2024-01-15").

4. **Error Responses**: All endpoints return error responses in the following format:
```json
{
  "success": false,
  "message": "Error message here"
}
```

5. **Success Responses**: All endpoints return success responses in the following format:
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message" (optional)
}
```

6. **Base URL**: Replace `http://localhost:5000` with your actual server URL if different.

7. **Token Expiry**: JWT tokens may expire. If you get a 401 Unauthorized error, login again to get a new token.

