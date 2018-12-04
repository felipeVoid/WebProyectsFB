const functions = require('firebase-functions');

const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);

const SENDGRID_API_KEY = functions.config().sendgrid.key;

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(SENDGRID_API_KEY);

exports.databaseEmail = functions.database.ref('/items/messages')
    .onCreate((snapshot, context) => {
        // Grab the current value of what was written to the Realtime Database.
        const original = snapshot.val();

        const msg = {
            to: 'rene.gonzalez@rinno.la',
            from: 'felipe.fende@gmail.com',
            subject: original,
            templateId: 'd-337cfb1366cd406fb0c4041fd5d0e0de',
            substitutionWrappers: ['{{', '}}'],
            substitutions: {
                name: 'Rene'
            }
        };
        sgMail.send(msg);
    });

