# Brazilian Chat Room (Bate-Papo UOL)

You can view the Bate-Papo UOL App live at <a href="https://rafaellatado.github.io/bate-papo-uol/" target="_blank">https://rafaellatado.github.io/bate-papo-uol/</a>.

## Technologies Used

- JavaScript: For interactivity and DOM manipulation.
- Axios/Fetch API: Makes HTTP requests to the Driven Bootcamp API for asynchronous data fetching.
- HTML: For structuring the content of the website.
- CSS: For styling and layout.
- Git: Tracks changes and manages the project's codebase.
- VSCode: The primary code editor used, offering various extensions and productivity tools.
- Google Fonts: For enhanced typography and design consistency.
- Ionicons: For iconography and visual elements.

## Project Description

The Brazilian Chat Room (Bate-Papo UOL Clone) is a front-end web application built as a working full-stack solution using the Driven Bootcamp API for back-end functionality. Developed with vanilla JavaScript, HTML, and CSS, the app delivers a real-time, interactive chat experience with asynchronous data handling.

Upon accessing the app, users are prompted to enter their name to join the chat. 

The chat supports three types of messages:

- Status Messages: System messages that notify users of events like someone entering or leaving the chat.
- Public Messages: Messages visible to all participants.
- Private Messages: Direct messages between two users, visible only to the sender and receiver.

Messages are color-coded for easy identification:

- Gray for status messages.
- White for public messages.
- Red for private messages.

To maintain user status and ensure seamless real-time interactions, the app utilizes setTimeout functions to periodically re-execute status update functions every few seconds, making asynchronous calls to the API. This ensures that users' online status is consistently updated, and the chat remains in sync.

Users can also toggle an animated menu to choose between sending a message to everyone, a specific user publicly, or a specific user privately. All message filtering and display logic are handled on the front end, while the Driven Bootcamp API manages real-time message handling.

### Feel free to explore the website and experience its features firsthand!
