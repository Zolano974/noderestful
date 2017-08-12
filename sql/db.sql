-- SERIE

CREATE TABLE `series` (
  `id`        int(11),
  `name`      varchar(50),
  `description`      varchar(200),
  `picture`   varchar(50),
  `mediatype`      enum('photo', 'video'),
  `created`   timestamp ,
  `updated`   timestamp,
  PRIMARY KEY (`id`)
);

-- PHOTO

CREATE TABLE `photos` (
  `id`          int(11),
  `title`       VARCHAR (50),
  `description` varchar(200),
  `file`        varchar (50),
  `created`     TIMESTAMP ,
  PRIMARY KEY (`id`)
);

-- VIDEO

CREATE TABLE `videos` (
  `id`          int(11),
  `title`       VARCHAR (50),
  `description` varchar(200),
  `file`        varchar (50),
  `created`     TIMESTAMP ,
  PRIMARY KEY (`id`)
);

-- USERS

CREATE TABLE `users` (
`id` int(11) AUTO_INCREMENT,
`username` varchar(50),
`password` varchar(200),
`email` varchar(200),
`admin` int(1),
PRIMARY KEY (`id`)
);

-- LINK SERIES VIDEOS

CREATE TABLE `link_series_videos` (
  `id`        int(11),
  `serie_id`  int(11),
  `video_id`  int(11),
  PRIMARY KEY (`id`)
);

-- LINK SERIES PHOTOS

CREATE TABLE `link_series_photos` (
  `id`        int(11),
  `serie_id`  int(11),
  `photo_id`  int(11),
  PRIMARY KEY (`id`)
);
