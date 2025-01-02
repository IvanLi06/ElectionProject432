const express = require('express');
const path = require('path');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const ballotRoutes = require('./routes/ballots');
const societyRoutes = require('./routes/societies');
const voteRoutes = require('./routes/votes');
const { sequelize } = require('./models'); 
require('dotenv').config();
const port = process.env.PORT || 3000;

const app = express();

// middleware
app.use(express.json());
// enable cors
app.use(cors());
//serve app
app.use(express.static(path.join(__dirname, '../client/build')));

// Swagger options
const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'API Documentation',
            version: '1.0.0',
            description: 'Login API Documentation',
        },
        servers: [
            {

                url: process.env.SERVER_URL, // Ensure this points to your API base URL
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
            schemas: {
                User: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Unique identifier for the user',
                        },
                        email: {
                            type: 'string',
                            description: 'Email of the user',
                        },
                    },
                },
                Ballot: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Unique identifier for the ballot',
                        },
                        title: {
                            type: 'string',
                            description: 'Title of the ballot',
                        },
                        societyID: {
                            type: 'integer',
                            description: 'Unique identifier for the society',
                        },
                        starttime: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Start time to active the ballot'
                        },
                        endtime: {
                            type: 'string',
                            format: 'date-time',
                            description: 'End time to active the ballot'
                        },
                        content: {
                            type: 'object',
                            description: 'Content of the ballot',
                            // include example here
                        },
                        active: {
                            type: 'boolean',
                            description: 'Flag that indicates if the ballot is active or not'
                        },
                        createdAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Creation time of the ballot'
                        },
                        updatedAt: {
                            type: 'string',
                            format: 'date-time',
                            description: 'Last modification time of the ballot'
                        },
                    }
                },
                Society: {
                    type: 'object',
                    properties: {
                        id: {
                            type: 'integer',
                            description: 'Unique identifier for the society',
                        },
                        name: {
                            type: 'string',
                            description: 'Full name of the society',
                        },
                        abbrev: {
                            type: 'string',
                            description: 'Abbreviiation of the society',
                        },
                        research_area: {
                            type: 'string',
                            description: 'Research area of the society'
                        },
                        
                    }
                }
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ['./src/routes/*.js'],
};

const swaggerDocs = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use('/auth', authRoutes);  // Ensure auth route is properly registered
app.use('/users', userRoutes); // Register user routes under /users
app.use('/ballots', ballotRoutes); // Register user routes under /users
app.use('/societies', societyRoutes); // Register user routes under /users
app.use('/votes', voteRoutes); // Register user routes under /users


app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/build/index.html'))
})

// Sync the models with the database
sequelize.sync({ force: false })  // force: true will drop and recreate tables on every run
  .then(() => {
    console.log('Database synced successfully');
    
    // Start the server only after the database is synced
    app.listen(port,() => {
      console.log(`Server is running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Error syncing the database:', err);
  });
