/*SELECT groups.id, styles.title AS style, age_groups.title AS age_group , 
levels.title AS level, instructors.name AS instructor, groups.price 
FROM groups 
LEFT OUTER JOIN styles ON groups.style = styles.id
LEFT OUTER JOIN age_groups ON groups.age_group = age_groups.id
LEFT OUTER JOIN levels ON groups.level = levels.id
LEFT OUTER JOIN instructors ON groups.instructor = instructors.id;*/

/*INSERT INTO groups (style, age_group, level, instructor, price)
VALUES (3, 2, 1, 5, 120);*/








