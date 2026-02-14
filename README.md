# 🎯 Habiture - Smart Habit Tracker

A modern, full-stack habit tracking web application built with FastAPI and vanilla JavaScript. Track your daily habits, build streaks, and visualize your progress with beautiful statistics.

![Habiture Banner](https://img.shields.io/badge/Status-Active-success)
![Python](https://img.shields.io/badge/Python-3.8+-blue)
![FastAPI](https://img.shields.io/badge/FastAPI-0.104+-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

## ✨ Features

### 🔐 User Authentication
- Secure user registration and login
- JWT-based authentication
- Password hashing with bcrypt
- Session management

### 📊 Habit Management
- Create, read, update, and delete habits
- Add descriptions to habits
- Organize habits with intuitive UI
- Separate pending and completed habits

### 🔥 Streak Tracking
- Daily completion tracking
- Current streak calculation
- Best streak records
- Total completion counts

### 📈 Statistics & Analytics
- Detailed habit statistics
- 30-day completion rate
- Visual progress bars
- Per-habit analytics cards

### ⚙️ User Profile
- Update username and email
- Change password securely
- Profile management interface

### 🎨 Modern UI/UX
- Dark mode design
- Gradient accents
- Smooth animations
- Responsive layout
- Mobile-friendly

## 🚀 Quick Start

### Prerequisites
- Python 3.8 or higher
- pip (Python package manager)
- Modern web browser

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Devendiran2007/Smart-Habbit-Tracker.git
cd Smart-Habbit-Tracker
```

2. **Create virtual environment**
```bash
python -m venv myvenv
```

3. **Activate virtual environment**
- Windows:
```bash
myvenv\\Scripts\\activate
```
- macOS/Linux:
```bash
source myvenv/bin/activate
```

4. **Install dependencies**
```bash
pip install -r requirements.txt
```

5. **Run the application**
```bash
uvicorn app.main:app --reload
```

6. **Open in browser**
Navigate to: `frontend/html/home_page.html`

The API will be running at `http://127.0.0.1:8000`

## 📁 Project Structure

```
Smart-Habbit-Tracker/
├── app/                      # Backend application
│   ├── routers/             # API route handlers
│   │   ├── users.py         # User authentication & profile
│   │   ├── habbits.py       # Habit CRUD operations
│   │   └── completions.py   # Completion tracking
│   ├── models.py            # Database models
│   ├── schemas.py           # Pydantic schemas
│   ├── database.py          # Database configuration
│   ├── auth.py              # JWT authentication
│   └── main.py              # FastAPI application
├── frontend/                # Frontend application
│   ├── html/               # HTML pages
│   │   ├── home_page.html  # Landing page
│   │   ├── login.html      # Login page
│   │   ├── signup.html     # Registration page
│   │   └── dashboard.html  # Main dashboard
│   ├── css/                # Stylesheets
│   │   ├── home_page.css
│   │   ├── auth.css
│   │   └── dashboard.css
│   └── js/                 # JavaScript files
│       ├── api.js          # API service
│       ├── auth.js         # Auth management
│       ├── dashboard.js    # Dashboard logic
│       └── home_page.js    # Homepage logic
├── requirements.txt        # Python dependencies
└── README.md              # This file
```

## 🛠️ Technology Stack

### Backend
- **FastAPI** - Modern Python web framework
- **SQLAlchemy** - SQL toolkit and ORM
- **SQLite** - Lightweight database
- **Pydantic** - Data validation
- **python-jose** - JWT tokens
- **bcrypt** - Password hashing
- **Uvicorn** - ASGI server

### Frontend
- **HTML5** - Structure
- **CSS3** - Styling with modern features
- **Vanilla JavaScript** - No frameworks
- **Google Fonts (Inter)** - Typography

## 📖 API Documentation

Once the server is running, visit:
- **Swagger UI**: `http://127.0.0.1:8000/docs`
- **ReDoc**: `http://127.0.0.1:8000/redoc`

### Key Endpoints

#### Authentication
- `POST /users/register` - Register new user
- `POST /users/login` - Login user
- `GET /users/me` - Get current user
- `PUT /users/me` - Update profile
- `PUT /users/me/password` - Change password

#### Habits
- `GET /habbits/habbits` - Get all habits
- `POST /habbits/create` - Create habit
- `PUT /habbits/habbits/{id}` - Update habit
- `DELETE /habbits/habbits/{id}` - Delete habit

#### Completions
- `POST /completions/{habit_id}` - Mark habit complete
- `DELETE /completions/{habit_id}` - Unmark completion
- `GET /completions/{habit_id}/today` - Check if completed today
- `GET /completions/{habit_id}/streak` - Get current streak
- `GET /completions/{habit_id}/stats` - Get detailed stats

## 🎯 Usage Guide

### 1. Create an Account
- Navigate to the homepage
- Click "Sign Up"
- Enter username, email, and password
- Submit to create account

### 2. Add Habits
- Login to your account
- Click "Add Habit" button
- Enter habit name and optional description
- Save to create habit

### 3. Track Completions
- Check the checkbox next to a habit to mark it complete
- Completed habits move to "Completed Today" section
- Uncheck to remove completion

### 4. View Statistics
- Navigate to "Statistics" tab
- View detailed analytics for each habit
- See streaks, completion rates, and progress

### 5. Manage Profile
- Navigate to "Profile" tab
- Update username or email
- Change password securely

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token-based authentication
- CORS middleware configured
- Input validation with Pydantic
- SQL injection protection via ORM
- Secure password requirements

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👨‍💻 Author

**Devendiran K**
- GitHub: [@Devendiran2007](https://github.com/Devendiran2007)

## 🙏 Acknowledgments

- FastAPI for the amazing framework
- Google Fonts for Inter typeface
- The open-source community

## 📧 Contact

For questions or feedback, please open an issue on GitHub.

---

**Built with ❤️ by Devendiran K**
