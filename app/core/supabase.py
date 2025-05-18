from supabase import create_client, Client
from app.core.config import settings
import httpx
import os

def get_supabase_client() -> Client:
    """
    Create and return a Supabase client instance.
    """
    # Remove any proxy settings from environment
    if 'HTTP_PROXY' in os.environ:
        del os.environ['HTTP_PROXY']
    if 'HTTPS_PROXY' in os.environ:
        del os.environ['HTTPS_PROXY']

    return create_client(
        supabase_url=settings.SUPABASE_URL,
        supabase_key=settings.SUPABASE_KEY
    )

# Create a singleton instance
supabase: Client = get_supabase_client() 