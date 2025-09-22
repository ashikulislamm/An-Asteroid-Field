# An Asteroid Field

An interactive 3D simulation built using **Three.js** where you can explore an asteroid field with a spaceship. The project features custom shaders, lighting, keyboard and mouse interactions, and procedural textures.

## Features

- **Custom Shaders**: A dynamic, animated starfield background that twinkles and changes over time.
- **Lighting**: Ambient and directional lighting to illuminate objects and cast shadows.
- **Perspective Projection**: A perspective camera that creates a realistic 3D space environment.
- **Procedural Textures**: Textures for the spaceship and asteroids generated at runtime for originality.
- **Animation**: Asteroids move and rotate, while the spaceship responds to keyboard input.
- **Keyboard Interaction**: Control the spaceship's movement, rotation, and speed using the keyboard.
- **Mouse Interaction**: Toggle between two spaceship textures (blue and red) on mouse click.

## How to Run Locally

1. **Clone the repository**:
    ```bash
    git clone https://github.com/ashikulislamm/An-Asteroid-Field.git
    cd An-Asteroid-Field
    ```

2. **Install dependencies**:
    ```bash
    npm install
    ```

3. **Start the development server**:
    ```bash
    npm run dev
    ```
   This will start the Vite development server and open the project in your browser.

4. **Build the project for production**:
    ```bash
    npm run build
    ```
   This will create a production-ready build in the `dist/` folder.

## Deploying on GitHub Pages

To deploy the project on GitHub Pages:

1. **Install `gh-pages` package**:
    ```bash
    npm install --save-dev gh-pages
    ```

2. **Build the project**:
    ```bash
    npm run build
    ```

3. **Deploy the project**:
    ```bash
    npm run deploy
    ```

   After the deployment is complete, your project will be available at:  
   `https://ashikulislamm.github.io/An-Asteroid-Field`

## Controls

- **W**: Accelerates the spaceship forward.
- **S**: Decelerates the spaceship and moves it backward.
- **Arrow Keys**: Steer the spaceship by controlling yaw (left-right), pitch (up-down), and roll (tilt).
- **A/D**: Roll the spaceship left or right.
- **Q/E**: Strafe the spaceship left or right.
- **Mouse Click**: Toggle between the blue and red spaceship textures.

## Technologies Used

- **Three.js**: For rendering the 3D environment, objects, and animations.
- **GLSL**: For creating custom shaders (starfield background).
- **Vite**: For the development server and bundling.
- **gh-pages**: For deploying the project to GitHub Pages.

## Future Work

- **Collision Detection**: Implement collision detection between the spaceship and asteroids.
- **Spaceship Upgrades**: Add different spaceship models with unique attributes.
- **Enhanced Asteroid Field**: Add more asteroid types and increase the size of the asteroid field.
- **Sound Effects**: Implement sound effects for interactions and background music.
- **Mobile Optimization**: Make the project responsive and playable on mobile devices.

## License

This project is open-source and available under the [MIT License](LICENSE).
