// Google Sign-In & Session Management
const GOOGLE_CLIENT_ID = '531794024182-ijn5lakupvv1g2csnhtn6cl7q34m5c2t.apps.googleusercontent.com';

// Initialize Google Sign-In
function initializeGoogleSignIn() {
    google.accounts.id.initialize({
        client_id: GOOGLE_CLIENT_ID,
        callback: handleGoogleSignIn,
    });
}

// Handle Google Sign-In callback
async function handleGoogleSignIn(response) {
    const token = response.credential;
    const decoded = parseJwt(token);
    
    console.log('Google Sign-In successful:', decoded);
    
    // Sign in to Firebase using the Google token
    try {
        const { auth, db } = await import('./firebase-init.js');
        const { GoogleAuthProvider, signInWithCredential } = await import('https://www.gstatic.com/firebasejs/9.24.0/firebase-auth.js');
        const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/9.24.0/firebase-firestore.js');
        
        const credential = GoogleAuthProvider.credential(token);
        const userCredential = await signInWithCredential(auth, credential);
        const user = userCredential.user;
        
        // Check if user profile exists
        const userDocRef = doc(db, 'users', user.uid);
        const userDocSnap = await getDoc(userDocRef);
        
        if (!userDocSnap.exists()) {
            // First time user - redirect to profile setup
            window.location.href = 'profile-setup.html';
        } else {
            // Existing user - check approval status
            const userData = userDocSnap.data();
            if (userData.approved) {
                // Redirect based on role
                if (userData.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                } else if (userData.role === 'employee') {
                    window.location.href = 'employee-dashboard.html';
                } else {
                    window.location.href = 'broker-dashboard.html';
                }
            } else {
                // Pending approval
                window.location.href = 'pending-approval.html';
            }
        }
    } catch (error) {
        console.error('Firebase sign-in error:', error);
        alert('Sign-in failed. Please try again.');
    }
}

// Parse JWT token
function parseJwt(token) {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    return JSON.parse(jsonPayload);
}

// Render Google Sign-In button
function renderGoogleSignInButton(containerId) {
    google.accounts.id.renderButton(
        document.getElementById(containerId),
        {
            theme: 'outline',
            size: 'large',
            text: 'signin_with',
        }
    );
}

// Sign out
async function signOut() {
    const { auth } = await import('./firebase-init.js');
    const { signOut: firebaseSignOut } = await import('https://www.gstatic.com/firebasejs/9.24.0/firebase-auth.js');
    await firebaseSignOut(auth);
    window.location.href = 'login.html';
}

// Check if user is authenticated
async function checkAuth() {
    return new Promise((resolve) => {
        import('./firebase-init.js').then(({ auth }) => {
            const { onAuthStateChanged } = auth;
            auth.onAuthStateChanged(user => resolve(user));
        });
    });
}

// Get user role
async function getUserRole(uid) {
    const { db } = await import('./firebase-init.js');
    const { doc, getDoc } = await import('https://www.gstatic.com/firebasejs/9.24.0/firebase-firestore.js');
    const userDocRef = doc(db, 'users', uid);
    const userDocSnap = await getDoc(userDocRef);
    return userDocSnap.data()?.role || null;
}

// Export for use in HTML
window.initializeGoogleSignIn = initializeGoogleSignIn;
window.renderGoogleSignInButton = renderGoogleSignInButton;
window.signOut = signOut;
window.checkAuth = checkAuth;
window.getUserRole = getUserRole;
