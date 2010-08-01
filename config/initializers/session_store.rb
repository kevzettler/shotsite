# Be sure to restart your server when you modify this file.

# Your secret key for verifying cookie session data integrity.
# If you change this key, all old sessions will become invalid!
# Make sure the secret is at least 30 characters and all random, 
# no regular words or you'll be exposed to dictionary attacks.
ActionController::Base.session = {
  :key         => '_seanshots_session',
  :secret      => 'c58db7f000b952579cb457428c333467a7be97a4f9775e4058efcb5286186ca3450213bf326b94b412bf8b55f2613d13a29e98a0d5dd27f3aab262d282420861'
}

# Use the database for sessions instead of the cookie-based default,
# which shouldn't be used to store highly confidential information
# (create the session table with "rake db:sessions:create")
# ActionController::Base.session_store = :active_record_store
