import { createClient } from '@supabase/supabase-js';

const client = createClient(process.env.NEXT_PUBLIC_INSFORGE_URL, process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY);
client.rpc('get_tables').then(console.log).catch(console.error);

client.from('bookings').select('*').limit(1).then(({ data, error }) => {
    if (error) console.error(error);
    else console.log('Bookings query success');
});

// Lets also try to query a users table
client.from('users').select('*').limit(1).then(({ data, error }) => {
    if (error) console.error('users table:', error.message);
    else console.log('Users table exists:', data);
});

client.from('profiles').select('*').limit(1).then(({ data, error }) => {
    if (error) console.error('profiles table:', error.message);
    else console.log('Profiles table exists:', data);
});
