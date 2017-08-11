-- SERIE

CREATE TABLE `series` (
  `id`        int(11),
  `name`      varchar(50),
  `picture`   varchar(50),
  `type`      enum('photo', 'video'),
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

-- uSERS

CREATE TABLE `users` (
`id` int(11) AUTO_INCREMENT,
`username` varchar(50),
`password` varchar(200),
`email` varchar(200),
`admin` int(1),
PRIMARY KEY (`id`)
);

-- MESSAGES (todelete)
CREATE TABLE `messages` (
`mid` int(11) AUTO_INCREMENT,
`message` text,
`uid_fk` int(11),
PRIMARY KEY (`mid`)
);
