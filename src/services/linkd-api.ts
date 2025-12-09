import { generateLinkedInQuery } from './gemini-api';

const API_BASE_URL = 'https://search.clado.ai';
const authToken = process.env.LINKD_API_KEY || null;

// Define the UserProfile interface to match the one in gemini-api.ts
interface UserProfile {
  universityName: string;
  fullName: string;
  gradeYear: string;
  clubs: string[];
  societies: string[];
  location: string;
}

// Types
export interface Experience {
  title: string;
  company_name: string;
  start_date: string;
  end_date: string | null;
  description: string;
  location: string;
  company_logo: string;
}

export interface Education {
  degree: string;
  field_of_study: string;
  school_name: string;
  start_date: string;
  end_date: string;
  description: string;
  school_logo: string;
}

export interface Profile {
  id: string;
  name: string;
  location: string;
  headline: string;
  description: string;
  title: string;
  profile_picture_url: string;
  linkedin_url: string;
}

export interface UserResult {
  profile: Profile;
  experience: Experience[];
  education: Education[];
}

export interface SearchResponse {
  results: UserResult[];
  total: number;
  query: string;
  error: string | null;
}

export interface SearchParams {
  query: string;
  limit?: number;
  schools?: string[];
  companies?: string[];
  advanced_filtering?: boolean;
}

// Function to search users
export const searchUsers = async (params: SearchParams): Promise<SearchResponse> => {
  console.log(`[${new Date().toISOString()}] [linkd-api] Searching with params:`, params);
  
  // Temporarily disable SSL verification for self-signed certificates in development
  const originalRejectUnauthorized = process.env.NODE_TLS_REJECT_UNAUTHORIZED;
  if (process.env.NODE_ENV === 'development') {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }
  
  try {
    const { query, limit = 5, schools, companies, advanced_filtering = true } = params;
    
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append('query', query);
    
    if (limit) {
      queryParams.append('limit', limit.toString());
    }
    
    if (advanced_filtering !== undefined) {
      queryParams.append('advanced_filtering', advanced_filtering.toString());
    }
    
    if (schools && schools.length > 0) {
      schools.forEach(s => queryParams.append('schools', s));
    }
    
    if (companies && companies.length > 0) {
      companies.forEach(c => queryParams.append('companies', c));
    }
    
    // Prepare headers
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Add auth token if available (API keys should start with 'lk_')
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;

      // Warn if API key doesn't start with expected prefix
      if (!authToken.startsWith('lk_')) {
        console.warn(`[${new Date().toISOString()}] [linkd-api] Warning: API key does not start with 'lk_' as documented. Current prefix: ${authToken.substring(0, 3)}...`);
      }
    } else {
      console.warn(`[${new Date().toISOString()}] [linkd-api] Warning: No auth token provided`);
    }
    
    // Make the request
    const requestUrl = `${API_BASE_URL}/api/search?${queryParams.toString()}`;
    console.log(`[${new Date().toISOString()}] [linkd-api] Request URL: ${requestUrl}`);

    const response = await fetch(
      requestUrl,
      {
        method: 'GET',
        headers,
      }
    );
    
    // Handle non-OK responses
    if (!response.ok) {
      // Handle 401 specifically
      if (response.status === 401) {
        const errorDetail = "Invalid or expired API key";
        throw new Error(errorDetail);
      }
      
      // Handle other errors
      try {
        const errorData = await response.json();
        const errorMessage = 
          errorData.error || 
          errorData.detail || 
          errorData.message || 
          JSON.stringify(errorData);
        throw new Error(errorMessage);
      } catch (jsonError) {
        throw new Error(`Request failed with status: ${response.status}`);
      }
    }
    
    // Parse and return successful response
    const result = await response.json();

    // Validate response structure
    if (!result.results || !Array.isArray(result.results)) {
      console.warn(`[${new Date().toISOString()}] [linkd-api] Unexpected response structure:`, JSON.stringify(result, null, 2));
      throw new Error('API returned unexpected response format');
    }

    console.log(`[${new Date().toISOString()}] [linkd-api] Found ${result.results.length} profiles`);

    // Add detailed logging when no results are found
    if (result.results.length === 0) {
      console.log(`[${new Date().toISOString()}] [linkd-api] No profiles found. Query: "${query}". Total: ${result.total || 0}. Full response:`, JSON.stringify(result, null, 2));
    }

    return result as SearchResponse;
    
  } catch (error) {
    console.error(`[${new Date().toISOString()}] [linkd-api] Error:`, error);
    
    if (error instanceof Error) {
      throw error;
    }
    
    // Generic error
    throw new Error('Failed to perform search. Please check your connection and try again.');
  } finally {
    // Restore original SSL setting
    if (process.env.NODE_ENV === 'development') {
      if (originalRejectUnauthorized !== undefined) {
        process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalRejectUnauthorized;
      } else {
        delete process.env.NODE_TLS_REJECT_UNAUTHORIZED;
      }
    }
  }
};