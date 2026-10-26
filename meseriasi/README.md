# Scamio pentru meseriași — V1

Interfață Next.js pentru aplicația destinată meseriașilor și firmelor mici.

## Pornire locală

1. Intră în folderul `meseriasi`.
2. Rulează `npm install`.
3. Rulează `npm run dev`.
4. Deschide http://localhost:3000.

## Stadiul actual

- Interfață responsive în limba română.
- Panou general, clienți și lucrări.
- Adăugare și căutare clienți/lucrări în interfață.
- Date demonstrative pentru a putea evalua fluxul și designul.

**Important:** aceasta este prima interfață funcțională de prototip. Datele sunt ținute în memoria paginii și se resetează la reîncărcare; nu este încă potrivită pentru date reale. Autentificarea și baza de date persistentă trebuie conectate în etapa următoare cu Supabase, după configurarea proiectului și a variabilelor de mediu.

## Publicare

Pentru a publica acest folder în Vercel, setează Root Directory la `meseriasi`. Nu modifica proiectul Vercel existent până nu verificăm configurația actuală.
