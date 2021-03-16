# Moduł BluePayment dla Venia PWA 

## Instalacia @magento/venia-concept

```bash
yarn create @magento/pwa
```
- *Project root directory (will be created if it does not exist)* - podajemy ścieżkę, gdzie ma się znaleźć projekt.
- *Short name of the project to put in the package.json "name" field* - podajemy nazwę projektu (np. pwa).
- *Name of the author to put in the package.json "author" field - dowolnie
- *Magento instance to use as a backend (will be added to `.env` file)* - wybieramy "Other (I will provide my own backing Magento instance)"
- *URL of a Magento instance to use as a backend* - podajemy adres sklepu (np. https://venia.magento2.bm.devmouse.pl)
- *Braintree API token to use to communicate with your Braintree instance (will be added to `.env` file)* - cokolwiek
- *NPM package management client to use* - dowolnie (yarn jest szybszy)
- *Install package dependencies with yarn after creating project* - Y

Następnie generujemy certyfikat SSL i tymczasową domenę (nie jest to wymagane, jeżeli będziemy uruchamiali przez reverse proxy):
```bash
yarn buildpack create-custom-origin .
```

## Uruchomienie projektu
Przechodzimy do katalogu z projektem
```bash
yarn run build
yarn start
```

## Instalacja modułu
```bash
yarn add @bluemedia/bluepayment-pwa
```
