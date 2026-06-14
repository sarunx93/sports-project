# Match Desk: Sports Management Application 💻
[Visit Site](https://sports-project-peach.vercel.app)

## Introduction
Nowadays, there is no objection that sports is likely the solution to cure worries and stress in life. 
In Thai society, there are 3 sports that are popular among Thais: 
  
  ⚽️  Football\
  🎾  Tennis\
  🏸  Badminton

Thai people love to play these sports and some of them even organize group or clubs for social sessions, both for commercial and leisure.\
The problem is when there are too many members than the organizers could handle and it could cause frustration among members.
This app ensures:
- Accurate player counts
- Everyone gets to play equally
- Current situation of the club is monitored

## Getting Started
```
git clone https://github.com/yourusername/sport-connect.git 
cd sport-connect 
npm install 
npm run dev
```

## Features
- Create and manage sport sessions
- Real-time player slot management
- Match Recored for future analysis
- User authentication and authorization
- Modern and inuitive UI

## Tech Stack
### Frontend
- Next.js 15
- React
- TypeScript
- Tailwind CSS
- Zustand

### Backend
- Next.js Server Actions
- REST APIs
- MongoDB

**Currently, only badminton feature is available. Sorry for any inconvinience**

# How to use

## 1.Login
All features in the website requires a user to login first as the routes are protected.
You can start by clicking Signin button at the Navbar and use your Google account.

## 2.Enter your details
Enter your club name and the sports of your choice, then hit 'Create your club'.
<img width="667" height="468" alt="Screenshot 2569-06-14 at 22 31 44" src="https://github.com/user-attachments/assets/899f4a75-e167-4a11-ba7c-f4f2e4e87636" />

## 3.Heading to arrage match page
After logging in, you can start arrange a match by clicking 'Arrange a match' button and head to arrange match page.
<img width="720" height="468" alt="Screenshot 2569-06-14 at 22 46 34" src="https://github.com/user-attachments/assets/12b512dd-44c2-4416-9521-7ed5baecdd47" />

## 4.Arrange your first match
On this page, you will see 3 main components: adding player box (top-left), waiting list (top-right) and team box (bottom).
### Steps
1. Add a player on the adding player box. Name and level are mandatory information, last name is optional.
2. The newly added player will appear on the waiting list. You can either add them further to the team box, remove them from waiting list or clear the waiting list entirely.
3. If you choose the pick a player to the team, then you can choose where the match's gonna be a doubles one or a singles one. You also need to input a court number and the it must be not be the as the ones that is playing.
4. If the match is ready, hit 'Start Match' right away.
<img width="572" height="520" alt="Screenshot 2569-06-14 at 22 48 05" src="https://github.com/user-attachments/assets/a238ef1d-8014-4963-98d6-747bf532f76c" />

## 5.Start and Record
First of all, you can choose to remove a match from the live matches section or start the timer. If you start the timer, then the match will be record thereafter.
<img width="823" height="430" alt="Screenshot 2569-06-14 at 23 07 21" src="https://github.com/user-attachments/assets/37821870-0682-432e-8a44-0750449c23aa" />

Now the clock is ticking, you can choose to pause, reset or finish the match.
<img width="658" height="715" alt="Screenshot 2569-06-14 at 23 11 50" src="https://github.com/user-attachments/assets/be2a0f22-f02c-4040-9939-c853d3000cbd" />

When you finish the match, you will be prompted to type down the scores (the accepted format is suggested in the modal), or you can choose to submit without scores. That is also doable.
<img width="551" height="535" alt="Screenshot 2569-06-14 at 23 11 58" src="https://github.com/user-attachments/assets/94ce25a9-4d1c-41e4-85a9-35c420f764fb" />

The match results will be saved in database for future use.


