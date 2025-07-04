# Personal Finance App (Learning Project)

## Overview

This app is a full-stack demo project designed to showcase my ability to produce a professional web application. The application features a few simple functionalities that are based on CRUD operations. The intended purpose of this project was to attempt to replicate designing, developing, and deploying a real commercial grade application for learning purposes.

---

## Tech Stack

**Frontend** 

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) 
![SCSS](https://img.shields.io/badge/SCSS-CC6699?style=for-the-badge&logo=sass&logoColor=white) 

**Backend**

![Express](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge) 
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)

**Database**

![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)

**DevOps**

![AWS EC2](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws) (RDS and EC2)


![Cloudflare](https://img.shields.io/badge/Cloudflare-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

**Other**

- D3.js
- Bcrypt


---

## The Journey

**1. Started as a frontend project**  
What initially started as a front-end challenge from [Frontend Mentor](https://www.frontendmentor.io/) (the design file credit goes to them), quickly turned into a full-stack project. I was not satisfied with just making things look pretty - instead my curiousity caused me to research how full-stack development works.

**2. Designed and Built from Scratch**  
- React + SCSS for the front-end: My first time structuring a serious SPA from the ground up.
- I began building modular components according to [Frontend Mentor](https://www.frontendmentor.io/)'s design file - I tried to make it as modular, as reusable, and as responsive as possible. 

**3. Backend and database**
- Before this, I had purely focused on frontend. Initially, I tried to set this up with Python/Django and Postgres but failed miserably as I was a bit overwhelmed. As a result, I had a short break and restarted the backend using Express/Node and SQLite. 
- Using Express has made me understand the flow between frontend, backend, and database and I am confident I could do it now with Python/Django. 
- Similarly, using SQLite has helped me conceptually grasp relational databases. I struggled with Postgres at the beginning, but when I started developing with SQLite - when I migrated later to Postgres, it was so much easier to understand.
- Using tools like [Postman](https://www.postman.com/) to test my API endpoints was a life saver. 

**4. DevOps: Baptism by Fire**  
- It was now time to deploy, and so far I had not focused on deployment at all besides a short course from Coursera. 
- I wanted to use AWS due to how popular it is in the professional world - being proficient in AWS would make me a valuable asset in software engineering.
- I set up Docker for local and cloud consistency.
- Deployed backend to AWS EC2 (Dockerized) with Nginx as a reverse proxy and HTTPS and database to AWS RDS.
- Frontend auto-deployed with Vercel.
- Connecting frontend, backend, database was next.

**4. Real Security and Networking**  
- Learned to use AWS security groups, VPC, and even set up my own WireGuard VPN on DigitalOcean to securely access private cloud resources from anywhere.
- Managed secrets via environment variables in `.env`.

**5. Finally everything worked**

- After finally solving all the networking, and security issues - my first app had finally worked and was deployed. Great success.

---



## Challenges

- **Networking Hell:** Getting AWS VPCs, security groups, and VPNs to play nice together was a wild ride.
- **CI/CD and Secrets:** Keeping everything secure without losing my mind.
- **Making it Production-ish:** HTTPS, domain routing, Nginx config, multi-environment .env setup.
- **State Management:** Lifting state, prop drilling, and (almost) using context for the first time.

---


## The Result: Features

- **Dashboard:** Overview of your finances
- **Budgets:** Set, edit, color-code, and track your spending.
- **Transactions:** Add, view, search, and sort—all with pagination.
- **Savings Pots:** Separate your goals visually and add/withdraw funds.
- **Responsive design:** Mobile, tablet, desktop.
- **Deployed!**:  
  - **Frontend:** Vercel + Cloudflare (https://project1.whiteriver-dev.com)  
  - **Backend/API:** AWS EC2 (Docker + Nginx + HTTPS) (https://api.project1.whiteriver-dev.com)  
  - **Database:** AWS RDS Postgres (VPC + VPN secured)

---

### Credits

- [Frontend Mentor](https://www.frontendmentor.io/) for providing the challenge, and the design (Figma file).
- ChatGPT - for being my tutor, assistant, and pair programmer (I may have vibe coded some of this)


