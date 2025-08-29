module.exports = {
    apps: [
        {
            name: 'FACE',
            script: 'dist/main.js',
            error_file: './logs/face.log',
            out_file: './logs/face.log',
            env: {
                NODE_ENV: 'prod',
                TYPE_ENV: 'FACE',
            },
        },

        {
            name: 'REVIEW_SYNC',
            script: 'dist/main.js',
            error_file: './logs/review-sync.log',
            out_file: './logs/review-sync.log',
            env: {
                NODE_ENV: 'prod',
                TYPE_ENV: 'SYNC',
            },
        },

        {
            name: 'ORGANIZATION_DATA_SYNC',
            script: 'dist/main.js',
            error_file: './logs/org-sync.log',
            out_file: './logs/org-sync.log',
            env: {
                NODE_ENV: 'prod',
                TYPE_ENV: 'SYNC',
            },
        },

        {
            name: 'MAILER',
            script: 'dist/main.js',
            error_file: './logs/mailer.log',
            out_file: './logs/mailer.log',
            env: {
                NODE_ENV: 'prod',
                TYPE_ENV: 'SYNC',
            },
        },
    ],
};
