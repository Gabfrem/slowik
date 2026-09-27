/* Słowik — configuration du service en ligne (comptes et sauvegarde dans Supabase).
   La clé « anon » est publique par conception : elle peut figurer dans le site.
   La sécurité repose sur les règles RLS de la base (voir supabase/schema.sql) :
   chaque utilisateur ne peut lire et écrire que sa propre progression.
   Ne jamais mettre ici la clé « service_role ». */
S.config = {
  supabaseUrl: 'https://vyyworugagseyggssimr.supabase.co',
  supabaseAnonKey:
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZ5eXdvcnVnYWdzZXlnZ3NzaW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTA1MjQxNTcsImV4cCI6MjEwNjEwMDE1N30.MTJSqJFaUSD4Z3UrQN1Cg38d3iopWiJtlsT9AMvey30',
  /* Adresse publique du site (GitHub Pages). Sert aux liens des e-mails (confirmation, mot de passe)
     quand l'application est ouverte en local. Laisser vide pour utiliser l'URL du projet Supabase. */
  siteUrl: '',
};
