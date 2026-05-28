# Cloud Cost Tracker - React Frontend

A responsive React frontend for the Cloud Cost Tracker application. Monitor and optimize your cloud resource costs through a polished dashboard, editing workflow, and CSV export.

## Features

- **Dashboard** - Overview of total costs, resources, and key metrics
- **Real-Time Resource Management** - Add, edit, and delete cloud resources
- **Cost Breakdown** - Detailed cost analysis with breakdown and distribution visuals
- **Insights** - Smart recommendations for optimization
- **Export Data** - Download current resource data as CSV
- **Edit Modal** - Update resources inside a clean modal dialog
- **Delete Confirmation** - Safe delete flow with confirmation
- **Modern UI** - Gradient design, card layout, animations, and responsive styling

## Tech Stack

- **React 18** - UI framework
- **Axios** - HTTP client for API communication
- **CSS3** - Styling and responsive layout
- **JavaScript ES6+** - Modern app logic

## Project Structure

```
frontend/
├── public/
│   └── index.html              # HTML entry point
├── src/
│   ├── components/             # React components
│   │   ├── Header.js           # App header
│   │   ├── Header.css
│   │   ├── Dashboard.js        # Main dashboard with CRUD + export
│   │   ├── Dashboard.css
│   │   ├── ResourceForm.js     # Add resource form
│   │   ├── ResourceForm.css
│   │   ├── EditResourceModal.js# Edit resource modal
│   │   ├── EditResourceModal.css
│   │   ├── CostBreakdown.js    # Cost visualization
│   │   ├── CostBreakdown.css
│   │   ├── Insights.js         # Cost insights
│   │   └── Insights.css
│   ├── services/
│   │   └── api.js              # API client configuration
│   ├── utils/
│   │   └── exportUtils.js      # CSV export utilities
│   ├── App.js                  # Main app component
│   ├── App.css
│   ├── index.js                # React entry point
│   └── index.css               # Global styles
├── package.json                # Dependencies
├── .gitignore
├── .env.example                # Environment variables template
└── README.md                   # This file
```

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm (v6 or higher)
- Backend server running on `http://localhost:8000`

### Steps

1. **Navigate to the frontend directory:**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create environment configuration:**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` if your backend API is running on a different URL.

4. **Start the development server:**
   ```bash
   npm start
   ```

   The application will open in your browser at `http://localhost:3000`.

## Available Scripts

### `npm start`
Runs the app in development mode. The page will reload when you make changes.

### `npm build`
Builds the app for production to the `build` folder.

### `npm test`
Launches the test runner (if tests are configured).

### `npm eject`
Ejects the Create React App configuration. **This is a one-way operation.**

## API Integration

The frontend communicates with the backend API through `src/services/api.js`.
The API client connects to:

**Default:** `http://localhost:8000`

### API Endpoints Used

- `GET /resources/` - Retrieve all resources
- `POST /resources/` - Create a new resource
- `PUT /resources/{resource_id}` - Update an existing resource
- `DELETE /resources/{resource_id}` - Delete a resource
- `GET /cost/` - Fetch total cost and breakdown
- `GET /insights/` - Fetch usage insights

## Component Overview

### Dashboard
Displays key metrics and provides quick resource management actions:
- Total cost
- Resource count
- Average cost
- Highest cost resource
- Resource list with edit and delete actions
- CSV export button

### Add Resource
A form for creating cloud resources with:
- Name
- Resource type
- Usage hours
- Cost per hour
- Live cost preview

### Edit Resource Modal
Update resource details in a focused overlay without leaving the page.

### Cost Breakdown
Shows detailed resource costs, percentage contributions, and distribution visuals.

### Insights
Provides optimization recommendations and usage-based cost analysis.

## Styling & Design

- Gradient backgrounds and soft glassmorphism cards
- Smooth hover transitions and animations
- Responsive layout for desktop and mobile
- Clear, readable data presentation

## Customization

### Change Color Scheme
Edit the gradient colors in `App.css` and component CSS files.

### Modify API URL
Create `.env.local` in the frontend directory and update:
```
REACT_APP_API_URL=http://your-backend-url:port
```

### Add New Components
1. Create a new file in `src/components/`
2. Add CSS file if needed
3. Import and use it in `App.js`

## Troubleshooting

### API Connection Issues
- Confirm backend is running at `http://localhost:8000`
- Ensure CORS is enabled on the backend
- Verify `REACT_APP_API_URL` if using a custom URL

### Port Already in Use
If port 3000 is taken:
```bash
PORT=3001 npm start
```

### Dependency Issues
If install problems occur:
```bash
rm -rf node_modules package-lock.json
npm install
```

## Future Enhancements

- [ ] Authentication and user accounts
- [ ] Historical cost tracking and trends
- [ ] Budget alerts and notifications
- [ ] Dark mode theme
- [ ] Advanced filtering and search
- [ ] Cost forecasting
- [ ] Resource tagging and organization

## Support

If you need help, check the backend README or contact your development team.
