(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/Sites/gapanalysis/frontend/lib/api.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/Sites/gapanalysis/frontend/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Sites/gapanalysis/frontend/node_modules/axios/lib/axios.js [app-client] (ecmascript)");
;
// Create axios instance with base configuration
const api = __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].create({
    baseURL: __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:3000',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});
// Request interceptor to add auth token
api.interceptors.request.use((config)=>{
    // Get token from localStorage if available
    if ("TURBOPACK compile-time truthy", 1) {
        const token = localStorage.getItem('accessToken');
        if (token) {
            config.headers.Authorization = "Bearer ".concat(token);
        }
    }
    return config;
}, (error)=>{
    return Promise.reject(error);
});
// Response interceptor to handle token refresh
api.interceptors.response.use((response)=>response, async (error)=>{
    var _error_response;
    const originalRequest = error.config;
    if (((_error_response = error.response) === null || _error_response === void 0 ? void 0 : _error_response.status) === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
            // Try to refresh the token
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$axios$2f$lib$2f$axios$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post("".concat(__TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.NEXT_PUBLIC_API_URL || 'http://localhost:3000', "/auth/refresh"), {
                    refreshToken
                }, {
                    withCredentials: true
                });
                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);
                // Retry the original request with new token
                originalRequest.headers.Authorization = "Bearer ".concat(accessToken);
                return api(originalRequest);
            }
        } catch (e) {
            // Refresh failed, redirect to login
            if ("TURBOPACK compile-time truthy", 1) {
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                window.location.href = '/auth/login';
            }
        }
    }
    return Promise.reject(error);
});
const __TURBOPACK__default__export__ = api;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Sites/gapanalysis/frontend/lib/auth.ts [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "authService",
    ()=>authService
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Sites/gapanalysis/frontend/lib/api.ts [app-client] (ecmascript)");
;
const authService = {
    // Login user (standard login)
    async login (credentials) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/login', credentials);
        // Get tokens from response data (backend now returns them)
        const accessToken = response.data.accessToken;
        const refreshToken = response.data.refreshToken;
        // Store tokens in localStorage for client-side access
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        }
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
        return {
            user: response.data.user,
            accessToken: accessToken || '',
            refreshToken: refreshToken || ''
        };
    },
    // Login to specific organization
    async loginToOrganization (credentials) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/login/organization', credentials);
        const accessToken = response.data.accessToken;
        const refreshToken = response.data.refreshToken;
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        }
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
        return {
            user: response.data.user,
            accessToken: accessToken || '',
            refreshToken: refreshToken || ''
        };
    },
    // Login by domain
    async loginByDomain (credentials) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/login/domain', credentials);
        const accessToken = response.data.accessToken;
        const refreshToken = response.data.refreshToken;
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        }
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
        return {
            user: response.data.user,
            accessToken: accessToken || '',
            refreshToken: refreshToken || ''
        };
    },
    // Get available organizations
    async getOrganizations () {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/organizations');
        return response.data;
    },
    // Get organization by domain
    async getOrganizationByDomain (domain) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get("/organizations/domain/".concat(domain));
        return response.data;
    },
    // Register new user
    async register (userData) {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/register', userData);
        // Get tokens from response data (backend now returns them)
        const accessToken = response.data.accessToken;
        const refreshToken = response.data.refreshToken;
        // Store tokens in localStorage for client-side access
        if (accessToken) {
            localStorage.setItem('accessToken', accessToken);
        }
        if (refreshToken) {
            localStorage.setItem('refreshToken', refreshToken);
        }
        return {
            user: response.data.user,
            accessToken: accessToken || '',
            refreshToken: refreshToken || ''
        };
    },
    // Logout user
    async logout () {
        try {
            // Try to call logout endpoint if it exists
            await __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/logout');
        } catch (error) {
            // If logout endpoint doesn't exist (404) or any other error, 
            // just log it but don't throw - logout should always succeed client-side
            if (error && typeof error === 'object' && 'response' in error && error.response && typeof error.response === 'object' && 'status' in error.response && error.response.status === 404) {
                console.log('Logout endpoint not available, proceeding with client-side logout');
            } else {
                console.error('Logout error:', error);
            }
        } finally{
            // Always clear tokens from localStorage regardless of backend response
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
        }
    },
    // Get current user
    async getCurrentUser () {
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].get('/auth/me');
        return response.data;
    },
    // Refresh token
    async refreshToken () {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            throw new Error('No refresh token available');
        }
        const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$lib$2f$api$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].post('/auth/refresh', {
            refreshToken
        });
        const { accessToken } = response.data;
        localStorage.setItem('accessToken', accessToken);
        return {
            accessToken
        };
    },
    // Check if user is authenticated
    isAuthenticated () {
        return !!localStorage.getItem('accessToken');
    },
    // Get stored access token
    getAccessToken () {
        return localStorage.getItem('accessToken');
    },
    // Get stored refresh token
    getRefreshToken () {
        return localStorage.getItem('refreshToken');
    }
};
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Sites/gapanalysis/frontend/contexts/AuthContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AuthProvider",
    ()=>AuthProvider,
    "useAuth",
    ()=>useAuth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Sites/gapanalysis/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Sites/gapanalysis/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Sites/gapanalysis/frontend/lib/auth.ts [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Sites/gapanalysis/frontend/node_modules/next/navigation.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
;
;
const AuthContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
const useAuth = ()=>{
    _s();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
_s(useAuth, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
const AuthProvider = (param)=>{
    let { children } = param;
    _s1();
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isLoading, setIsLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [error, setError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const isAuthenticated = !!user;
    // Check if user is already authenticated on app load
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "AuthProvider.useEffect": ()=>{
            const checkAuth = {
                "AuthProvider.useEffect.checkAuth": async ()=>{
                    try {
                        if (__TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].isAuthenticated()) {
                            const userData = await __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].getCurrentUser();
                            setUser(userData);
                            // Redirect Super Admin to Super Admin dashboard if they're on the regular dashboard
                            if (userData.role === 'SUPER_ADMIN' && window.location.pathname === '/dashboard') {
                                router.push('/dashboard/super-admin');
                            }
                        }
                    } catch (error) {
                        console.error('Auth check failed:', error);
                        // Clear invalid tokens
                        localStorage.removeItem('accessToken');
                        localStorage.removeItem('refreshToken');
                    } finally{
                        setIsLoading(false);
                    }
                }
            }["AuthProvider.useEffect.checkAuth"];
            checkAuth();
        }
    }["AuthProvider.useEffect"], [
        router
    ]);
    const login = async (credentials)=>{
        try {
            setIsLoading(true);
            setError(null);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].login(credentials);
            setUser(response.user);
            // Redirect based on user role
            if (response.user.role === 'SUPER_ADMIN') {
                router.push('/dashboard/super-admin');
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            var _error_response_data, _error_response;
            const errorMessage = ((_error_response = error.response) === null || _error_response === void 0 ? void 0 : (_error_response_data = _error_response.data) === null || _error_response_data === void 0 ? void 0 : _error_response_data.message) || 'Login failed. Please try again.';
            setError(errorMessage);
            throw error;
        } finally{
            setIsLoading(false);
        }
    };
    const register = async (userData)=>{
        try {
            setIsLoading(true);
            setError(null);
            const response = await __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].register(userData);
            setUser(response.user);
            // Redirect based on user role
            if (response.user.role === 'SUPER_ADMIN') {
                router.push('/dashboard/super-admin');
            } else {
                router.push('/dashboard');
            }
        } catch (error) {
            var _error_response_data, _error_response;
            const errorMessage = ((_error_response = error.response) === null || _error_response === void 0 ? void 0 : (_error_response_data = _error_response.data) === null || _error_response_data === void 0 ? void 0 : _error_response_data.message) || 'Registration failed. Please try again.';
            setError(errorMessage);
            throw error;
        } finally{
            setIsLoading(false);
        }
    };
    const logout = async ()=>{
        try {
            await __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$lib$2f$auth$2e$ts__$5b$app$2d$client$5d$__$28$ecmascript$29$__["authService"].logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally{
            setUser(null);
            router.push('/auth/login');
        }
    };
    const clearError = ()=>{
        setError(null);
    };
    const value = {
        user,
        isLoading,
        isAuthenticated,
        login,
        register,
        logout,
        error,
        clearError
    };
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(AuthContext.Provider, {
        value: value,
        children: children
    }, void 0, false, {
        fileName: "[project]/Sites/gapanalysis/frontend/contexts/AuthContext.tsx",
        lineNumber: 136,
        columnNumber: 10
    }, ("TURBOPACK compile-time value", void 0));
};
_s1(AuthProvider, "aN/4P5mvQargRXOuRMxkP9Ug2bY=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"]
    ];
});
_c = AuthProvider;
var _c;
__turbopack_context__.k.register(_c, "AuthProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/Sites/gapanalysis/frontend/contexts/ThemeContext.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ThemeProvider",
    ()=>ThemeProvider,
    "useTheme",
    ()=>useTheme
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Sites/gapanalysis/frontend/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/Sites/gapanalysis/frontend/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature(), _s1 = __turbopack_context__.k.signature();
'use client';
;
const ThemeContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["createContext"])(undefined);
function ThemeProvider(param) {
    let { children } = param;
    _s();
    const [theme, setTheme] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])('light');
    const [mounted, setMounted] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            // Get theme from localStorage or default to light
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                setTheme(savedTheme);
            } else {
                // Check system preference
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
                setTheme(prefersDark ? 'dark' : 'light');
            }
            setMounted(true);
        }
    }["ThemeProvider.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "ThemeProvider.useEffect": ()=>{
            if (mounted) {
                localStorage.setItem('theme', theme);
                document.documentElement.classList.toggle('dark', theme === 'dark');
            }
        }
    }["ThemeProvider.useEffect"], [
        theme,
        mounted
    ]);
    const toggleTheme = ()=>{
        setTheme(theme === 'light' ? 'dark' : 'light');
    };
    const handleSetTheme = (newTheme)=>{
        setTheme(newTheme);
    };
    if (!mounted) {
        return null; // Prevent hydration mismatch
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(ThemeContext.Provider, {
        value: {
            theme,
            toggleTheme,
            setTheme: handleSetTheme
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/Sites/gapanalysis/frontend/contexts/ThemeContext.tsx",
        lineNumber: 52,
        columnNumber: 5
    }, this);
}
_s(ThemeProvider, "irO646EbSVqPL90dedilwyEs6oc=");
_c = ThemeProvider;
function useTheme() {
    _s1();
    const context = (0, __TURBOPACK__imported__module__$5b$project$5d2f$Sites$2f$gapanalysis$2f$frontend$2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useContext"])(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
_s1(useTheme, "b9L3QQ+jgeyIrH0NfHrJ8nn7VMU=");
var _c;
__turbopack_context__.k.register(_c, "ThemeProvider");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=Sites_gapanalysis_frontend_49dd6651._.js.map