CREATE TABLE `users` (
`uid` int(11) AUTO_INCREMENT,
`username` varchar(50),
`password` varchar(200),
`email` varchar(200),
PRIMARY KEY (`uid`)
);

CREATE TABLE `messages` (
`mid` int(11) AUTO_INCREMENT,
`message` text,
`uid_fk` int(11),
PRIMARY KEY (`mid`)
);
