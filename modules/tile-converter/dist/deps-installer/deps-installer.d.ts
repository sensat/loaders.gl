/**
 * Install external dependencies for converter:
 * * PGM file (implemented);
 * * Draco library (not implemented);
 * * 7z archiver (not implemented);
 */
export declare class DepsInstaller {
    /**
     * Run instalation
     * @param path destination folder
     * @param workersPath destination folder for workers.
     *    This path is '' by default and is not used by tile-converter.
     *    It is used in tests to prevent rewriting actual workers during tests running
     */
    install(path?: string, workersPath?: string): Promise<void>;
    private installWorker;
}
//# sourceMappingURL=deps-installer.d.ts.map