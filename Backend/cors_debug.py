"""
CORS Debug Configuration - Temporary fix for testing
Replace the CORS middleware in main.py with this configuration for debugging
"""

# TEMPORARY DEBUG MODE - ALLOW ALL ORIGINS
DEBUG_CORS_CONFIG = {
    "allow_origins": ["*"],  # Allow all origins for debugging
    "allow_credentials": False,  # Must be False when using "*"
    "allow_methods": ["*"],
    "allow_headers": ["*"],
    "expose_headers": ["*"],
}

# PRODUCTION CORS CONFIG
PRODUCTION_CORS_CONFIG = {
    "allow_origins": [
        # Development
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        # Production domains
        "https://dozzl.xyz",
        "https://www.dozzl.xyz",
        "http://dozzl.xyz",
        "http://www.dozzl.xyz",
        # Vercel deployments
        "https://synqq.vercel.app",
        "https://synqq-neon.vercel.app",
        # API domain
        "https://api.dozzl.xyz",
        "http://api.dozzl.xyz",
    ],
    "allow_origin_regex": r"https://.*\.vercel\.app",
    "allow_credentials": True,
    "allow_methods": ["*"],
    "allow_headers": ["*"],
    "expose_headers": ["*"],
}

"""
To enable debug mode, replace the CORS middleware in main.py with:

app.add_middleware(
    CORSMiddleware,
    **DEBUG_CORS_CONFIG
)
"""