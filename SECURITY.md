# Security Policy

## Reporting a Vulnerability

We take security vulnerabilities seriously. If you discover a security issue in TDN-API, please report it responsibly — **do not open a public GitHub issue.**

### Preferred Method

Use GitHub's private vulnerability reporting:  
**[Report a vulnerability](https://github.com/the-developer-network/tdn-api/security/advisories/new)**

This ensures the issue remains confidential until a fix is in place.

### Alternative

If you are unable to use GitHub's reporting tool, you can reach us directly:

**security contact:** [admin@developernetwork.net](mailto:admin@developernetwork.net)

Please include the following in your report:

- A clear description of the vulnerability
- Steps to reproduce the issue
- Potential impact assessment
- Any suggested remediation (optional)

---

## Response Timeline

| Stage                    |           Timeframe           |
| :----------------------- | :---------------------------: |
| Initial acknowledgement  |        Within 48 hours        |
| Vulnerability assessment |    Within 5 business days     |
| Fix & disclosure         | Coordinated with the reporter |

---

## Supported Versions

Only the latest version of TDN-API receives security updates.

| Version         | Supported |
| :-------------- | :-------: |
| Latest (`main`) |    ✅     |
| Older branches  |    ❌     |

---

## Disclosure Policy

We follow a **coordinated disclosure** approach:

1. Reporter submits the vulnerability privately.
2. We confirm and assess the issue.
3. A fix is developed and tested.
4. A security advisory is published after the fix is released.
5. Credit is given to the reporter (unless they prefer to remain anonymous).

---

## Scope

The following are considered **in scope**:

- Authentication and authorization bypass
- Data exposure or leakage
- SQL injection or query manipulation
- Remote code execution
- Denial of service vulnerabilities
- Insecure direct object references (IDOR)

The following are considered **out of scope**:

- Vulnerabilities in third-party dependencies (report these upstream)
- Issues requiring physical access to the server
- Social engineering attacks
- Rate limiting bypass without demonstrated impact

---

## Recognition

We genuinely appreciate responsible disclosure. Reporters who follow this policy will be credited in the relevant security advisory unless they request otherwise.

---

_This policy is inspired by industry best practices and may be updated over time._
