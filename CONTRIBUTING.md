# Contributing 🍻

Hey there !! We are open for new issues and pull requests. 

Developer setup steps are covered in the [README][readme]. This file explains how our dev process works. If you'd like to contribute and don't understand something here, reach out on [gitter][gitter]

[readme]: https://github.com/mozilla/FirefoxColor/blob/master/README.md
[gitter]: http://gitter.im/Caligatorapp/community

### 👋 Say Hola!

If you're new contributor, please drop "Hi" in🍻 [gitter][gitter]! We are excited 😎 to know about you and we can also help you with 
finding issues that are a good fit for your skills/interests, and ensuring
you have a contact person to guide you through the bug fixing process, answer
any questions, and help if you get stuck.

### 📌 Find issues to work on

The project uses an [issue tracker][issue] to keep information about bugs to fix, project features to implement, documentation to write, and more. If you're new to the project, you can look for **good first issues** issues.

[issue]: https://github.com/teamxenox/caligator/issues/

### 📌 Contributing code

#### 🍴 Fork and Clone

We work with fork based approach for contribution. Fork the [repository][repo] and create a clone to your machine.

[repo]: https://github.com/teamxenox/caligator

#### 🎋 Branches

Create one branch **per issue** on your forked repo.

Few tips for branching -
- Branchout from `dev`
- Branch name should start with the issue id, and include a very short description of the issue *(under 4 words)*, Eg., `100-dark-theme`, `101-incorrect-currency-conversion`, `102-parser-engine`
- Before you work on any new feature, try to merge `caligator/dev` into your `dev` branch

#### ✅ Commit messages

Commit messages should generally follow [this][commit]

[commit]: https://www.conventionalcommits.org/en/v1.0.0/#summary

#### ⬆️ Submitting the pull request

When you submit a pull request, please use the description field to explain in words the overall intention of your changes. A few sentences should be plenty. It's also ok to reuse the commit message, if you included a lot of discussion there.

- Raise Pull request to [caligator/dev](https://github.com/teamxenox/caligator/tree/dev) branch from your branch.

#### 🔍Reviews

We try to avoid landing any code without at least a cursory review.

General rules for picking up reviews:
 - if you are going to review a PR, assign yourself to it
 - assigned person is responsible for helping get the PR over the finish line
 - if a PR doesn't have an assigned person, it's up for grabs

Reviewers will run through roughly the following checklist:
- Does the code do what it says it does?
- Is the proposed fix the right fix? Does it address the underlying cause of the bug?
- Is the code as simple as possible, while still addressing the issue? Are there unnecessary abstractions or optimizations?
- Does the code make sense? Can you understand it on a localized and global level?
- Does the code belong where it is? Is there a better place to put it?
- Does the code fit the overall style? This includes simple syntactic choices, as well as following broader patterns/architectural approaches used elsewhere in the codebase.
- Are there enough comments in the code? If commented code was changed, have the comments been updated?
- Are class, function, event, and variable names descriptive? Do they match the existing style?
- Are boundary cases considered?
- Are error cases handled?
- All tests and linting passed?
- Are there tests for new/changed code?

#### 📥 Merging

When a pull request has passed review, the **reviewer** generally **squash merges the code**.
