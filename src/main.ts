import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';

/**
 * The bootstrap function initializes the Nest.js application by creating an instance of the AppModule,
 * enabling shutdown hooks for graceful termination, and starting the application on the specified port (3000).
 */
async function bootstrap() {
  // Create an instance of the Nest.js application using AppModule
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      methods: 'POST, GET, PUT, DELETE, OPTIONS',
      origin: true,
    },
  });

  // Get config from env file
  const config = app.get(ConfigService);

  // Enable shutdown hooks to perform cleanup before application termination
  app.enableShutdownHooks();

  // Start the application and listen on port defined by config env file
  await app.listen(config.getOrThrow('APP_PORT'));
}

// Call the bootstrap function to start the application
// noinspection JSIgnoredPromiseFromCall
bootstrap();
