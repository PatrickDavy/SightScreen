/**
 * Writing an export to disk and handing it to the share sheet.
 *
 * The seam exists so `domain/export.ts` can stay pure: it decides what the
 * files say, this decides where they land. That split is what lets the whole
 * export be tested without a filesystem, and it is why `index.fake.ts` can
 * substitute an in-memory version for tests and for web.
 *
 * Files are written under the app's own document directory. That needs no
 * storage permission, is removed when the app is uninstalled, and never touches
 * shared media — see docs/permissions.md. Sharing is how the bowler actually
 * gets the data off the phone, and it is their choice where it goes: nothing
 * here uploads anything.
 */
import { Directory, File, Paths } from 'expo-file-system';

import { ExportFile } from '@/domain/export';

import { FileExporter, WrittenExport } from './types';

/**
 * expo-sharing is loaded lazily and defensively.
 *
 * It is a native module, so it is absent on web and in any environment without
 * a dev client. A missing share sheet must not lose an export that has already
 * been written to disk — the files are the deliverable, sharing is the
 * convenience — so this degrades to reporting the path instead.
 */
async function loadSharing(): Promise<{
  isAvailableAsync(): Promise<boolean>;
  shareAsync(url: string, options?: Record<string, unknown>): Promise<void>;
} | null> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    return require('expo-sharing');
  } catch {
    return null;
  }
}

export function createFileExporter(): FileExporter {
  return {
    async writeExport(folder: string, files: ExportFile[]): Promise<WrittenExport> {
      const directory = new Directory(Paths.document, folder);
      directory.create({ idempotent: true });

      const written: string[] = [];
      for (const file of files) {
        const handle = new File(directory, file.name);
        handle.create({ overwrite: true });
        handle.write(file.contents);
        written.push(handle.uri);
      }

      return { directoryUri: directory.uri, fileUris: written };
    },

    async share(uri: string): Promise<boolean> {
      const sharing = await loadSharing();
      if (!sharing) return false;
      try {
        if (!(await sharing.isAvailableAsync())) return false;
        await sharing.shareAsync(uri);
        return true;
      } catch {
        // A cancelled or unavailable share is not a failed export.
        return false;
      }
    },
  };
}
