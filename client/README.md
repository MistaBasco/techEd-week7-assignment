Assignment Reflection
Requirements Achieved
Client: Created a client using React with reusable components such as AnimeCard, ReviewCard, and LikeButton. Implemented state management with useState and useEffect for data fetching and dynamic interaction.

Server: Built an Express server with various GET and POST endpoints for user authentication, retrieving anime details, posting reviews, and managing likes. These endpoints allow for efficient CRUD operations.

React Form: Implemented forms for creating user reviews and managing user signup and login using React, including proper form validation and state management.

Multiple Pages: Set up multiple pages using React Router, including routes for HomePage, AnimeDetailPage, UserDetailsPage, and a dynamic NotFoundPage for handling unmatched routes.

Database Schema: Designed and seeded the database with realistic data using PostgreSQL. The schema includes tables for users, anime, reviews, genres, tags, and a many-to-many relationship between anime and tags.

SQL Queries: Used SQL for retrieving posts and anime details from the database, including advanced joins for pulling related data like tags and calculating average ratings. The likes system was also implemented efficiently with SQL-based counting.

Display with .map(): Displayed all posts (reviews) and anime on their respective pages using .map() in React, ensuring a dynamic rendering of data fetched from the server.

Stretch Goals Achieved
Dynamic Pages: Created dynamic pages using React Router, such as /anime/:id and /user/:id, which render content based on the route parameters.

Delete Functionality: Implemented the ability for users to delete their reviews, with appropriate authorization checks to ensure only the author can delete.

Like Functionality: Implemented the ability for users to like reviews. The system ensures users can only like a review once, and the like count is updated in real-time.

Filtered SQL Queries: Added SQL queries to show filtered posts, such as filtering reviews by anime or fetching specific tags associated with anime.

Challenges Faced
Session-Based Authentication: One of the biggest challenges was ensuring proper session-based authentication across the client and server. Debugging session persistence and handling CORS issues, especially during deployment, required careful attention to middleware and configuration.

Dynamic Routing and State: There were some difficulties in handling dynamic routing and keeping state updated across multiple components, especially when dealing with asynchronous data fetching.

Optional Reflection
Sources of Help: Quite frankly Gpt-4o was an absolute lifesaver, having access to the demo code and previous projects was quite handy to use as reference too.

Errors/Bugs: Some common errors included CORS misconfigurations, session handling issues, and mismatches in client-server communication (e.g., mismatched URLs after deployment). These were solved by careful debugging, including logging responses at both the client and server sides.

What Went Well: Implementing CRUD operations for the review and like system went smoothly once the database schema was established. The logic for liking reviews and preventing multiple likes was particularly satisfying to complete.

What Could Have Gone Better: The initial implementation of user authentication and handling of edge cases like session expiration could have been better planned from the start. Additionally, CSS styling, particularly ensuring the UI was responsive, required additional time.
