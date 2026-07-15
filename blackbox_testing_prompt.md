Act as a Software Quality Assurance Engineer. I am writing a paper titled "FSM-Based Automated Provisioning and Real-Time Monitoring System for FTTH Networks". 
Please generate a Black-Box Testing results table for Section "3.3. Testing Results". 
The system is built using React JS, Express JS, MySQL, and integrates with the MikroTik API and a Telegram bot for notifications.

URL Web App :
http://localhost:5173/

Credential :
 - Admin :
    username : admin
    password : admin123
- Technician :
    username : technician
    password : tech123

Format the output strictly as a Markdown table with the following columns:
1. Scenario
2. Input
3. Expected Output
4. Actual Output
5. Pass/Fail Status

Generate at least 8 realistic testing scenarios covering the following modules based on the implemented Waterfall SDLC requirements:
- Authentication (Login interface)
- Provisioning form validation (Input Data Form)
- Automated FSM Provisioning execution (Create PPP Account, Register ONU, Configure PON Interface)
- Device Credentials configuration (MikroTik and OLT connection testing)
- Real-time Network Monitoring dashboard data load (Bandwidth & Health)
- Telegram notification trigger upon provisioning completion

Ensure the "Actual Output" matches the "Expected Output", and set all statuses to "Pass".
make sure  all of the rows doesn't have a fail status
