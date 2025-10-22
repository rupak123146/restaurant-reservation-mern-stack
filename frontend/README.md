# 🍽️ ReserveMyTable - Restaurant Reservation System

A modern, full-featured restaurant reservation system built with React, featuring user authentication, restaurant search, booking management, and a beautiful responsive UI.

## ✨ Features

### 🔍 **Restaurant Search & Browsing**
- Advanced search with filters (cuisine, location, price range)
- Beautiful restaurant cards with ratings and details
- Real-time search functionality
- 6 sample restaurants with complete data

### 📅 **Reservation Booking**
- Comprehensive booking form with validation
- Restaurant-specific time slots
- Special requests support
- Form validation with error handling

### 👤 **User Authentication**
- User registration and login
- Persistent authentication with localStorage
- Protected routes and user-specific features
- User profile management

### 📋 **Reservation Management**
- View all user reservations
- Edit existing reservations
- Cancel reservations with confirmation
- Reservation status tracking

### 🎨 **Modern UI/UX**
- Responsive design for all devices
- Beautiful gradient backgrounds
- Interactive hover effects and animations
- Professional color scheme and typography
- Loading states and error handling

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` (or the port shown in your terminal)

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── RestaurantSearch.jsx    # Restaurant search and filtering
│   ├── RestaurantCard.jsx      # Individual restaurant display
│   ├── Navbar.jsx              # Navigation bar with auth
│   ├── Footer.jsx              # Site footer
│   ├── PageLayout.jsx          # Page wrapper component
│   ├── LoadingSpinner.jsx      # Loading indicator
│   ├── ErrorBoundary.jsx       # Error handling
│   └── ReservationForm.jsx     # Reservation form component
├── pages/                # Main application pages
│   ├── Home.jsx                # Landing page with search
│   ├── Login.jsx               # User login
│   ├── Register.jsx            # User registration
│   ├── Reserve.jsx             # Reservation booking
│   ├── MyReservations.jsx      # Reservation management
│   └── Confirmation.jsx        # Booking confirmation
├── context/              # React Context providers
│   └── AuthContext.jsx         # Authentication state management
├── data/                 # Static data and mock APIs
│   └── restaurants.js          # Restaurant data
└── App.jsx               # Main application component
```

## 🎯 Key Components

### **RestaurantSearch**
- Advanced filtering by cuisine, location, and price
- Real-time search functionality
- Responsive grid layout

### **RestaurantCard**
- Displays restaurant information
- Star ratings and price indicators
- Direct booking integration

### **AuthContext**
- User authentication state management
- Persistent login with localStorage
- Registration and login functions

### **Reservation Management**
- Complete CRUD operations for reservations
- Form validation and error handling
- Status tracking and management

## 🎨 Design Features

- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Modern UI**: Clean, professional interface with smooth animations
- **Color Scheme**: Professional blue and green palette
- **Typography**: Clean, readable fonts with proper hierarchy
- **Interactive Elements**: Hover effects, transitions, and feedback

## 🔧 Technical Features

- **React Hooks**: Modern functional components with hooks
- **Context API**: Global state management for authentication
- **React Router**: Client-side routing and navigation
- **Form Validation**: Comprehensive input validation
- **Error Handling**: Error boundaries and user-friendly error messages
- **Loading States**: Proper loading indicators throughout the app
- **Local Storage**: Persistent data storage for development

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full-featured experience with all components visible
- **Tablet**: Adapted layout with touch-friendly interactions
- **Mobile**: Streamlined interface with mobile-first design

## 🚀 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🔮 Future Enhancements

- Backend API integration
- Real-time notifications
- Payment processing
- Restaurant admin panel
- Advanced search filters
- User reviews and ratings
- Email confirmations
- Calendar integration

## 🛠️ Technologies Used

- **React 19** - Frontend framework
- **React Router DOM** - Client-side routing
- **React Icons** - Icon library
- **CSS3** - Styling and animations
- **Vite** - Build tool and dev server
- **ESLint** - Code linting

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📞 Support

For support, email support@reservemytable.com or create an issue in the repository.

---

**Made with ❤️ for food lovers everywhere**