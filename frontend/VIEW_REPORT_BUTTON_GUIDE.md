# View Report Button Implementation Guide

## Overview
The `ViewReportButton` is a reusable floating button component that appears in the top-right corner of data entry pages, allowing users to quickly navigate to their corresponding report pages.

## Features
- 🎨 Green gradient design with document icon
- 📱 Fully responsive (desktop, tablet, mobile)
- 🎯 Fixed positioning in top-right corner
- ✨ Smooth hover animations
- 🔗 Easy navigation to report pages

## How to Use

### Step 1: Import the Component
```javascript
import { ViewReportButton } from '../Components/Buttons';
```

### Step 2: Add to Your Page
Place the button at the top level of your component's return statement:

```javascript
return (
  <div className="your-container">
    <ViewReportButton to="/your-report-page-url" />
    {/* Rest of your content */}
  </div>
);
```

## Implementation Examples

### Example 1: Tensile Test Page
```javascript
import React, { useState } from 'react';
import { ViewReportButton } from '../Components/Buttons';

const Tensile = () => {
  return (
    <div className="tensile-container">
      <ViewReportButton to="/tensile/report" />
      {/* Form content */}
    </div>
  );
};
```

### Example 2: QC Production Details Page
```javascript
import React, { useState } from 'react';
import { ViewReportButton } from '../Components/Buttons';

const QcProductionDetails = () => {
  return (
    <div className="qcproduction-container">
      <ViewReportButton to="/qc-production-details/report" />
      {/* Form content */}
    </div>
  );
};
```

### Example 3: Impact Test Page
```javascript
import React, { useState } from 'react';
import { ViewReportButton } from '../Components/Buttons';

const Impact = () => {
  return (
    <div className="impact-container">
      <ViewReportButton to="/impact/report" />
      {/* Form content */}
    </div>
  );
};
```

### Example 4: Micro Structure Page
```javascript
import React, { useState } from 'react';
import { ViewReportButton } from '../Components/Buttons';

const MicroStructure = () => {
  return (
    <div className="microstructure-container">
      <ViewReportButton to="/micro-structure/report" />
      {/* Form content */}
    </div>
  );
};
```

### Example 5: Process Records Page
```javascript
import React, { useState } from 'react';
import { ViewReportButton } from '../Components/Buttons';

const Process = () => {
  return (
    <div className="process-container">
      <ViewReportButton to="/process/report" />
      {/* Form content */}
    </div>
  );
};
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `to` | string | No | URL path to navigate to (e.g., "/tensile/report") |
| `onClick` | function | No | Custom click handler (alternative to `to`) |

## Notes

1. **Positioning**: The button is fixed positioned and will stay in the top-right corner even when scrolling
2. **Z-Index**: Set to 999 to appear above most content
3. **Responsive**: Automatically adjusts size and position for different screen sizes
4. **Navigation**: Uses `window.location.href` for navigation by default
5. **Custom Handler**: Can use `onClick` instead of `to` for custom behavior

## Pages That Should Have This Button

Add the ViewReportButton to all data entry pages that have corresponding report pages:

### QC Testing Pages:
- ✅ Tensile Test → `/tensile/report`
- ✅ QC Production Details → `/qc-production-details/report`
- ⬜ Impact Test → `/impact/report`
- ⬜ Micro Tensile Test → `/micro-tensile/report`
- ⬜ Micro Structure → `/micro-structure/report`

### Production Pages:
- ⬜ Process Records → `/process/report`

### Melting Pages:
- ⬜ Melting Log Sheet → `/melting-logs/report`
- ⬜ Cupola Holder Log → `/cupola-holder-logs/report`

### Moulding Pages:
- ⬜ DMM Settings → `/dmm-settings/report`
- ⬜ Dismatic Product Report → `/dismatic-reports/report`
- ⬜ Mould Hardness → `/mould-hardness/report`

### Sand Lab Pages:
- ⬜ Foundary Sand Testing → `/sand-testing/report`
- ⬜ Sand Testing Record → `/sand-testing-record/report`

## Styling

The button uses a green gradient theme:
- Primary: `#10b981` (Emerald 500)
- Hover: `#059669` (Emerald 600)
- Shadow: Green with opacity

The design matches the professional look of your application with:
- Rounded corners (12px)
- Smooth transitions (0.3s)
- Hover lift effect
- Icon + text layout

## Customization

If you need to customize the button, edit the `ViewReportButtonWrapper` styled component in:
```
frontend/src/Components/Buttons.jsx
```

You can modify:
- Colors (background gradient)
- Position (top, right values)
- Size (padding, min-width)
- Icon (FileText component)
- Animations (transition, transform)

---

**Created by:** AI Assistant
**Last Updated:** 2025-01-30

