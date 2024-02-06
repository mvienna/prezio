<p align="center"><a href="https://prezio.com" target="_blank"><img src="https://i.imgur.com/SGB13km.png" width="300" alt="Prezio Logo"></a></p>

## About project

An online platform that helps to create interactive presentations using
the mechanics of mobile engagement and audience activation

Stack:
- [Quasar Framework](https://quasar.dev/)
- [Laravel - The PHP Framework](https://laravel.com/)

<br/>

## Setting up

> ‼️ Don't forget to setup .env for your development environment

```
git clone git@github.com:mvienna/prezio.git prezio
cd prezio
```


### Backend

```
PHP 8.2

cp .env.example .env
ln .env ./frontend/.env

composer install

php artisan key:gen

# or use [laravel valet (for macos)](https://laravel.com/docs/10.x/valet)
- php artisan serve

# manually run these commands
- php artisan websockets:serve
- php artisan schedule:word
- php artisan queue:work
```

### Frontend

```
Node v18

npm i -g @quasar/cli

cd frontend/

npm install

# serve
quasar dev

# build
quasar build
```
