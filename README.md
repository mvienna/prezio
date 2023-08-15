<p align="center"><a href="https://prezio.com" target="_blank"><img src="https://i.imgur.com/SGB13km.png" width="300" alt="Prezio Logo"></a></p>

## About project

An online platform that helps to create interactive presentations using
the mechanics of mobile engagement and audience activation

Stack:
- [Quasar Framework](https://quasar.dev/)
- [Laravel - The PHP Framework](https://laravel.com/)


Helpful links:
- [Trello tasks](https://trello.com/b/uPN6x14I/prezio)
- [Figma design](https://www.figma.com/file/1C8H55WvAZWarn3oSsQUzp/Prezio?type=design&mode=design)
- [Doc](https://trello.com/c/8OE5yfdG/1-%D1%82%D0%B7)

<br/>

## Setting up

### 🔒️ Backend

```
PHP 8.2

git clone git@gitlab.com:nomadicsoft/ru/prezio.git prezio
cd prezio
cp .env.example .env
ln .env ./frontend/.env

Add DB, PUSHER , MAIL settings to .env file

composer install

php artisan key:gen

- php artisan serve
- php artisan queue:listen
```

### 🌐 Frontend

```
Node v18

npm i -g @quasar/cli

cd frontend/
npm install
npm serve

http://localhost:9000
```
