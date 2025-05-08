exports = {
  bulk_contact_sync_job: async function (args) {
    const contacts = args.contacts;
    let index = args.index;
    const contactsToSync = args.contactsToSync;
    const batchSize = args.batchSize;
    const failed = [];
    let created = 0;
    await $job.updateStatusMessage(`in-progress success:${created}/${args.batchSize} failed:${failed.length}`);
    try {
      for (const contact of contacts) {
        console.log('contact');
        console.log(contact.name, contact.email);
        try {
          await $request.invokeTemplate("create_fs_contact", {
            context: {},
            body: JSON.stringify({
              first_name: contact.name,
              primary_email: contact.email
            })
          });
          console.info(`Contact created: ${contact.name} (${contact.email})`);
          created++;
          await $job.updateStatusMessage(`in-progress success:${created}/${args.batchSize} failed:${failed.length}`);
        } catch (error) {
          console.error("Error: Failed to create contact");
          console.error(error);
          failed.push({ name: contact.name, email: contact.email, error: { status: error.status, message: error.response } });
          await $job.updateStatusMessage(`in-progress success:${created}/${args.batchSize} failed:${failed.length}`);
        }
      }
      index = index + batchSize;
      if (index >= contactsToSync.length) {
        index = 0;
      }
      await $db.set("contact_sync_index", { index });
      await $db.set("last_failed_batch", { failed });
      console.info('Contact sync completed');
    } catch (error) {
      console.error('Error: Failed to create contacts');
      console.error(error);
    }
  }
};
