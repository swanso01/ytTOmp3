// worker1.js

addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
  });
  
  async function handleRequest(request) {
    // Parse the request URL
    const url = new URL(request.url);
    
    // Check if it's a GET request to the `/convert` endpoint
    if (url.pathname === '/convert' && request.method === 'GET') {
      const youtubeUrl = url.searchParams.get('url');
      
      if (!youtubeUrl) {
        return new Response('YouTube URL is required', { status: 400 });
      }
      
      // Call the external API to convert YouTube video to MP3
      const apiUrl = `https://api.example.com/convert?url=${encodeURIComponent(youtubeUrl)}`;
      
      try {
        const apiResponse = await fetch(apiUrl);
        const data = await apiResponse.json();
        
        if (data.success) {
          // Return a response with a download link for the MP3
          return new Response(JSON.stringify({ mp3Url: data.mp3Url }), {
            headers: { 'Content-Type': 'application/json' },
          });
        } else {
          return new Response('Error converting video', { status: 500 });
        }
      } catch (error) {
        return new Response('Error connecting to the conversion API', { status: 500 });
      }
    }
  
    // Return a default message for any other route
    return new Response('Welcome to the YouTube to MP3 service!', { status: 200 });
  }
  