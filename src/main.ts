import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

/**
 * The bootstrap function initializes the Nest.js application by creating an instance of the AppModule,
 * enabling shutdown hooks for graceful termination, and starting the application on the specified port (3000).
 */
async function bootstrap() {
  // Create an instance of the Nest.js application using AppModule
  const app = await NestFactory.create(AppModule);

  // Enable shutdown hooks to perform cleanup before application termination
  app.enableShutdownHooks();

  // Start the application and listen on port 3000
  await app.listen(3000);
}

// Call the bootstrap function to start the application
bootstrap();
