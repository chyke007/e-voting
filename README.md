<h1 align="center">
  <br>
  <a href="https://youtu.be/xls_7abY27I"><img src="https://github.com/chyke007/e-voting/raw/master/preview.png" alt="Youtube Demo" title="Youtube Demo" width="200"></a>
  <br>
  E-Voter
  <br>
</h1>
<h4 align="center">E-Voter, is a WhatsApp chatbot voting application using NodeJs and Twilio .</h4>

<p align="center">
  <a href="#key-features">Key Features</a> •
  <a href="#how-to-use">How To Use</a> •
  <a href="#credits">Credits</a> •
  <a href="#you-may-also-like">Related</a> •
  <a href="#license">License</a>
</p>

## Key Features

- Vote
  - Vote for a candidate.
  - See List of candidates
  - See a comprehensive result from votes cast
- Security
  - Prevents a user from voting multiple times
  - Restricts admin functionality to only an admin
- Dynamic
  - Admin can add and delete candidate
  - Admin can delete votes
  - Admin can delete all candidates and votes to restart the voting
- Scalable
  - Allows unlimited number of candidates
  - Allows unlimited number of votes
  - Allows simultaneous voting

## How To Use

To clone and run this application, you'll need [Git](https://git-scm.com) and [Node.js](https://nodejs.org/en/download/) v15+ (which comes with [npm](http://npmjs.com)) installed on your computer. You would need to setup a Twilio account, then go to sandbox and add the url of this api as your webhook. Also add required credentials to the .env file created from the command below.From your command line:

```bash
# Clone this repository
$ git clone https://github.com/chyke007/e-voting.git

# Go into the repository
$ cd e-voting

# Copy environment variable
$ cp .env.example .env

# Install dependencies
$ npm install

# Run the app
$ node index.js
```

## Credits

This application uses the following open source packages:

- [Twilio](https://twilio.com/)
- [Node.js](https://nodejs.org/)
- [ExpressJs](https://expressjs.com/)

## Support

<a href="https://www.patreon.com/chyke007">
	<img src="https://c5.patreon.com/external/logo/become_a_patron_button@2x.png" width="160">
</a>

## You may also like

- [PC](https://github.com/chyke007/pc) - A Project crashing software for project management
- [Cinema](https://github.com/chyke007/cinemaapp) - A cinema app
- [Yum-Food](https://github.com/chyke007/Yum-food) - A Food ordering app

## License

MIT

---

> [chibuikenwa.com](https://www.chibuikenwa.com) &nbsp;&middot;&nbsp;
> GitHub [@chyke007](https://github.com/chyke007) &nbsp;&middot;&nbsp;
> LinkedIn [@chibuike-nwachukwu-29a7a0111](https://linkedin.com/in/chibuike-nwachukwu-29a7a0111)
