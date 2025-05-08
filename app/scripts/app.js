document.addEventListener("DOMContentLoaded", function () {
  init();
});

async function init() {
  window.client = await app.initialized();
  client.events.on('app.activated', renderText);
}

async function getIndex() {
  try {
    const syncIndex = await client.db.get("contact_sync_index");
    if ((syncIndex === undefined) || (syncIndex.index === undefined)) {
      return 0;
    }
    return syncIndex.index;
  } catch (error) {
    console.error("Error: Failed to get index");
    console.error(error);
    return 0;
  }
}

async function setIndex(index) {
  try {
    await client.db.set("contact_sync_index", { index });
  } catch (error) {
    console.error("Error: Failed to set index");
    console.error(error);
  }
}

function renderText() {
  const statusDiv = document.getElementById("status");
  const syncButton = document.getElementById("sync-btn");

  syncButton.addEventListener("click", async function () {
    syncButton.disabled = true;
    
    // For simplicity, we are using a static list of contacts to sync.
    // In a real-world scenario, you would fetch this list from your desired application.
    const contactsToSync = [
      {
        email: "contact1@email.com",
        name: "Contact 1"
      },
      {
        email: "contact2@email.com",
        name: "Contact 2"
      },
      {
        email: "contact3@email.com",
        name: "Contact 3"
      },
      {
        email: "contact4@email.com",
        name: "Contact 4"
      }
    ];
    const index = await getIndex();
    const batchSize = 10;
    const batch = contactsToSync.slice(index, index + batchSize);
    const options = { contacts: batch, index, batchSize: batch.length < batchSize ? batch.length : batchSize, contactsToSync };
    try {
      const res = await client.job.invoke("bulk_contact_sync_job", "contacts_sync", options);
      console.info("Job invoked successfully");

      const jobId = res.id;
      statusDiv.innerHTML = `
        <p class="job_started_status">⏳ Job started...</p>
        <p class="job_status_message">Processing batch of ${options.batchSize} contacts</p>
      `;

      const pollJobStatus = async () => {
        const jobStatus = await client.job.get(jobId);

        if (jobStatus.status === "success") {
          console.info(jobStatus.status_message);
          const html = `
            <p class="job_completed_status">✅ ${jobStatus.status.toUpperCase()}</p>
            <p class="job_status_message">The contacts sync has been completed successfully!</p>
          `;
          statusDiv.innerHTML = html;
          syncButton.disabled = false;
          return;
        }

        let html = `
          <p class="job_started_status">⏳ ${jobStatus.status.toUpperCase()}</p>
        `;
        if (jobStatus.status_message) {
          html += `<p class="job_status_message">${jobStatus.status_message}</p>`;
        }
        statusDiv.innerHTML = html;
        
        // Poll the job status every 2 seconds
        setTimeout(pollJobStatus, 2000);
      };
      pollJobStatus();
    } catch (error) {
      console.error("Error invoking job");
      console.error(error);
      statusDiv.innerHTML = `
        <p class="job_failed_status">❌ Error</p>
        <p class="job_status_message">Failed to start the sync job</p>
      `;
      syncButton.disabled = false;
    }
  });
}
