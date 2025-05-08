# Jobs Sample App

This app shows how to use the **Jobs** feature to create contacts in batches asynchronously that executes for longer duration.

## Use Case

The app enables support agents or admins to:

* Trigger the job from the app to create contacts.
* Check the status of the contacts creation.
* Get the final result of the contact creation job execution.

All operations are performed using the built-in **Jobs** feature from the Freshworks Developer Platform.

## Features Demonstrated

1. **Trigger Job**

   * Create a serverless function to run it as a background job.

2. **Make API within job function**

   * Use Request Method to create a contact. Use any other platform features within the job function depending on the use case.

3. **Set Job status**

   * Set the status of the job while job execution. The final status will be overridden by the platform to notify the overall job status.

## Setup Instructions

1. **Clone the repository:**

   ```bash
   git clone https://github.com/freshworks-developers/jobs-samples.git
   cd jobs-samples
   ```

2. **Install the Freshworks CLI:**

   ```bash
   npm install -g fdk
   ```

3. **Run the app locally:**

   ```bash
   fdk run
   ```

4. **Test the app in Freshservice (or any supported product):**

   * Create the contact by invoking the job, send job status, view the job status in the app UI.

## Notes

* Ensure the job actions and concurrent invocations are within Freshworks platform constraints referring to [the limits and constraints page](https://developers.freshworks.com/docs/app-sdk/v3.0/common/rate-limits-and-constraints/).

## Contributing

Feel free to raise issues or PRs to improve the sample app!

## License

GPL-3.0 license
