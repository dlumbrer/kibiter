# Kibiter 6.8.6

Kibiter is a custom soft fork of [Kibana](https://github.com/elastic/kibana) which empowers [GrimoireLab](https://chaoss.github.io/grimoirelab/) Panels with metrics & data visualizations.

- [Installation](#installation)
- [Features](#features)
- [Compatibility with Elasticsearch](#compatibility-with-elasticsearch)
- [Contributing](#contributing)
- [License](#license)

## Installation

There are several ways for installing Kibiter on your system: from releases, Docker images or source code.

### Releases

- Go to [release tab](https://github.com/chaoss/grimoirelab-kibiter/releases) and download the version you want.

### Docker images

There are four Docker images of Kibiter, they have the following tags:

- `bitergia/kibiter:community-v6.8.6-X` (being X the version of the release), the image that corresponds to the community version of Kibiter.
- `bitergia/kibiter:optimized-v6.8.6-X` (being X the version of the release), the image that corresponds to the optimized version of Kibiter.
- `bitergia/kibiter:secured-v6.8.6-X` (being X the version of the release), the image that corresponds to the secured (with Search Guard) version of Kibiter.

#### Docker env variables for the secured version

There are docker env variables for the secured image (`bitergia/kibiter:secured-v6.8.6-X`) that should be defined:

- `ELASTICSEARCH_URL`: This env variable defines the URL or URL's of the ElasticSearch that Kibiter will connect. This env variable must be an array of the endpoints, each one must be a string.
- `BASE_PATH`: Enables you to specify a path to mount Kibiter at if you are running behind a proxy.
- `PROJECT_NAME`: The name of the project that will be in the menu top bar and the page title.
- `ELASTICSEARCH_USER`: Username that will use Kibiter to connect to ElasticSearch.
- `ELASTICSEARCH_PASSWORD`: Password of the username that will use Kibiter to connect to ElasticSearch.
- `ANONYMOUS_USER`: If true, the anonymous user will be activated. If not defined or false, the anonymous user will be deactivated. ElasticSearch with SearchGuard plugin must have activated the anonymous authentication (`ANONYMOUS_USER` if using [Bitergia](https://github.com/Bitergia/elasticsearch) ElasticSearch image).
- `LOGIN_BRANDIMAGE`: This env variable must be an URL to an image, this image will be the logo of the login form. If not defined, the Bitergia logo will appear.
- `LOGIN_TITLE`: A string (or HTML) that will define the title of the login. If not defined, the title will be: `Please login to Bitergia Analytics Dashboard`.
- `LOGIN_SUBTITLE`: A string (or HTML) that will define the subtitle of the login. If not defined, the subtitle will be: `If you have forgotten your username or password, please contact the <a href="mailto:support@bitergia.com?Subject=Credentials" target="_top">Bitergia staff</a>`.

### Source code

Clone the repository from the branch `integration-6.8.6-<version>`, where version can be empty or //community//.
```
git clone https://github.com/chaoss/grimoirelab-kibiter -b integration-6.8.6-<version>
```

Install the npm dependencies

```
cd grimoirelab-kibiter
yarn kbn bootstrap
```

Launch Kibiter
```
./bin/kibana --oss
```

## Features

Kibiter provides several features, not present in Kibana, that have been developed for GrimoireLab. The most important ones are described below.

### Panel menu

If you are using Kibiter with the [GrimoireLab](https://chaoss.github.io/grimoirelab/) tools, you will see a quick menu at the top of the page, like the one below:

<img alt="Panel menu" src="https://i.imgur.com/6hO4aEV.png">


This menu allows you to navigate through the GrimoireLab panels, see its structure below:

<img alt="Panel menu opened" src="https://i.imgur.com/9yimD9m.png">

### New visualization plugins

Kibiter has several plugins installed by default, they improve the user customization and add more information to the dashboards. Clearly, they are all open source. The plugins are listed below:

- [Network plugin](https://github.com/dlumbrer/kbn_network) supports data visualization in a graph-style way.
- [Searchtables plugin](https://github.com/dlumbrer/kbn_searchtables) improves Kibiter tables by adding a search box to perform searches without applying filters.
- [Radar plugin](https://github.com/dlumbrer/kbn_radar) allows to explore the data using radar visualizations.
- [Dot plot plugin](https://github.com/dlumbrer/kbn_dotplot) empowers Kibiter with dot-plot visualizations, granting  to add metrics in both X and Y axis.
- [Polar plugin](https://github.com/dlumbrer/kbn_network) enhances Kibiter with polar visualizations for your data.
- [Enhanced table](https://github.com/fbaligand/kibana-enhanced-table) This Kibtier visualization plugin uses the Data Table, but with enhanced features like computed columns, filter bar and pivot table.

## Version compatibility with Elasticsearch

Following the Kibana docs, you should be running Elasticsearch and Kibiter with matching version numbers. However, Kibiter will run (and log a warning) in case your Elasticsearch has a newer minor or patch number. 
Note that Kibiter won't be able to run, if your Elasticsearch has an older version number or a newer _major_ number. 

The table below shows some examples to illustrate the relationships between different types of version numbers.

| Situation                 | Example Kibiter version     | Example ES version | Outcome |
| ------------------------- | -------------------------- |------------------- | ------- |
| Versions are the same.    | 5.1.2                      | 5.1.2              | 💚 OK      |
| ES patch number is newer. | 5.1.__2__                  | 5.1.__5__          | ⚠️ Logged warning      |
| ES minor number is newer. | 5.__1__.2                  | 5.__5__.0          | ⚠️ Logged warning      |
| ES major number is newer. | __5__.1.2                  | __6__.0.0          | 🚫 Fatal error      |
| ES patch number is older. | 5.1.__2__                  | 5.1.__0__          | ⚠️ Logged warning      |
| ES minor number is older. | 5.__1__.2                  | 5.__0__.0          | 🚫 Fatal error      |
| ES major number is older. | __5__.1.2                  | __4__.0.0          | 🚫 Fatal error      |

## Contributing

We happily accept contributions, and we will help you in case you need. We follow the same contribution process that Kibana provides, thus have a look at:

- [CONTRIBUTING.md](CONTRIBUTING.md) if you want to get Kibiter up and running.
- [STYLEGUIDE.md](STYLEGUIDE.md) if you plan to submit a pull request.
- [GitHub issue tracker](https://github.com/chaoss/grimoirelab-kibiter/issues) for all other questions, we will answer you as soon as possible.

If you find a bug or want to request a new feature, please open a issue on [GitHub](https://github.com/chaoss/grimoirelab-kibiter/issues). To avoid duplicated issues, check the existing issues to make sure someone else hasn't already created a similar one.