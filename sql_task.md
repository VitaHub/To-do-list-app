### SQL task

1. Get all statuses, not repeating, alphabetically ordered:
  ```sql
  SELECT DISTINCT status 
  FROM tasks 
  ORDER BY status ASC;
  ```

2. Get the count of all tasks in each project, order by tasks count descending:
  ```sql
  SELECT COUNT(projects.id) 
  FROM projects 
  LEFT OUTER JOIN tasks 
    ON projects.id = tasks.project_id 
  GROUP BY projects.id 
  ORDER BY COUNT(*) DESC;
  ```

3. Get the count of all tasks in each project, order by projects names:
  ```sql
  SELECT count 
    FROM (
      SELECT DISTINCT projects.name, COUNT(projects.id) 
      FROM projects 
      LEFT OUTER JOIN tasks 
        ON projects.id = tasks.project_id 
      GROUP BY projects.id 
      ORDER BY projects.name
    ) q;
  ```

4. Get the tasks for all projects having the name beggining with "N" letter:
  ```sql
  SELECT tasks.* 
  FROM tasks 
  LEFT OUTER JOIN projects 
    ON tasks.project_id = projects.id 
  WHERE projects.name LIKE 'N%';
  ```

5. Get the list of all projects containing the 'a' letter in the middle of the name, 
and shows the tasks count near each project. Mention that there can exist projects without tasks and tasks with project_id = NULL:
  ```sql
  SELECT projects.*, COUNT(tasks.id) AS tasks_count 
  FROM projects 
  LEFT OUTER JOIN tasks 
    ON projects.id = tasks.project_id 
  WHERE projects.name LIKE '%_a_%' 
  GROUP BY projects.id;
  ```

6. Get the list of tasks with duplicate names ordered alphabetically:
  ```sql
  SELECT * 
  FROM tasks 
  WHERE name IN ( 
    SELECT name 
    FROM tasks 
    GROUP BY name 
    HAVING COUNT(*) > 1
  ) ORDER BY name ASC;
  ```

7. Get the list of tasks having several exact matches of both name and status, from the project 'Garage'. Order by matches count:
  ```sql
  SELECT tasks.* 
  FROM tasks 
  JOIN ( 
    SELECT tasks.name, tasks.done, COUNT(*) AS cnt 
    FROM tasks 
    LEFT OUTER JOIN projects 
      ON tasks.project_id = projects.id 
    WHERE projects.name = 'Garage' 
    GROUP BY tasks.name, tasks.done 
    HAVING COUNT(*) > 1
  ) q 
    ON tasks.name = q.name 
    AND tasks.done = q.done 
  ORDER BY cnt, tasks.name ASC;
  ```

8. Get the list of projects names having more than 10 tasks in status 'completed'. Order by project_id:
  ```sql
  SELECT projects.name 
  FROM projects 
  LEFT OUTER JOIN tasks 
    ON projects.id = tasks.project_id 
  WHERE tasks.status = 'completed' 
  GROUP BY projects.id 
  HAVING COUNT(*) > 10 
  ORDER BY projects.id;
  ```