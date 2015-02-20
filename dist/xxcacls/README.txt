Introduction
============

This is a patched version of the Microsoft XCACLS.VBS script, which can 
be used to set/adjust ownership and access rights for multiple files and 
directories at once.

The patches are the result of some work with XCACLS on some extremely 
stubborn drives, which were loaded from a destroyed Windows system, and 
include forcing ownership using the Microsoft TAKEOWN.EXE tool.
          
XCACLS.VBS comes with a batchfile (XXCACLS.BAT) which can be used to run
the tool.


Examples of use
===============

xxcacls . /f /s /t /e /o Administrators /c /l j:\xxcacls.log /fo /g Administrators:F /i enable /qq
                           
                           
References to the originals
===========================

XCACLS.VBS: 
    http://support.microsoft.com/kb/825751
    http://www.microsoft.com/downloads/details.aspx?familyid=0ad33a24-0616-473c-b103-c35bc2820bda&displaylang=en
    
TAKEOWN.EXE
    http://technet2.microsoft.com/windowsserver/en/library/2278512b-fe04-419c-8331-99c91b78d7dd1033.mspx?mfr=true
    

XCACLS.VBS help/manual
======================

------------------------------------------------------------------
---------------------------- Usage -------------------------------
------------------------------------------------------------------
Displays or modifies access control lists (ACLs) of files & directories

XCACLS filename [/E] [/G user:perm;spec] [...] [/R user [...]]
                [/F] [/S] [/T]
                [/P user:perm;spec [...]] [/D user:perm;spec] [...]
                [/O user] [/FO] [/I ENABLE/COPY/REMOVE] [/N
                [/L filename] [/Q] [/QQ] [/C] [/DEBUG]

   filename            [Required] If used alone, it Displays ACLs.
                       (Filename can be a filename, directory name or
                       wildcard characters and can include the entire
                       path. If path is missing, its assumed to be
                       under the current directory.
                       Notes:
                       - Put filename in quotes if it has spaces or
                         special characters such as &, $, #, etc.
                       - If Filename is a directory, all files and
                         sub directories under it will NOT be changed
                         unless the /F or /S is present.

   /F                  [Used with Directory or Wildcard] This will change all
                       files under the inputed directory but will NOT
                       traverse sub directories unless /T is also present.
                       If filename is a directory, and /F is not used, no
                       files will be touched.

   /S                  [Used with Directory or Wildcard] This will change all
                       sub folders under the inputed directory but will NOT
                       traverse sub directories unless /T is also present.
                       If filename is a directory, and /S is not used, no
                       sub directories will be touched.

   /T                  [Used only with a Directory] Traverses each
                       subdirectory and makes the same changes.
                       This switch will traverse directories only if the
                       filename is a directory or is using wildcards.
   /E                  Edit ACL instead of replacing it.

   /G user:GUI         Grant security permissions similar to Windows GUI
                       standard (non-advanced) choices.
   /G user:Perm;Spec   Grant specified user access rights.
                       (/G adds to existing rights for user)

                       User: If User has spaces in it, surround it in Quotes
                             If User contains #machine#, it will replace
                             #machine# with the actual machine name if its a
                             non-domain controller, and replace it with the
                             actual domain name if it is a domain controller.

                             New to 3.0: User can be a string representing
                             the actual SID, but MUST be lead by SID#
                             Example: SID#S-1-5-21-2127521184-160...
                                      (SID string shown has been shortened)
                                      (If any user has SID# then globally all
                                       matches must match the SID (not name)
                                       so if your intention is to apply changes
                                       to all accounts that match Domain\User
                                       then do not specify SID# as one of the
                                       users)

                       GUI: Is for standard rights and can be:
                             Permissions...
                                    F  Full control
                                    M  Modify
                                    X  read & eXecute
                                    L  List folder contents
                                    R  Read
                                    W  Write
                             Note: If a ; is present, this will be considered
                             a Perm;Spec parameter pair

                       Perm: Is for "Files Only" and can be:
                             Permissions...
                                    F  Full control
                                    M  Modify
                                    X  read & eXecute
                                    R  Read
                                    W  Write
                             Advanced... (Assumes "/SPEC G")
                                    E Synchronize
                                    D Take Ownership
                                    C Change Permissions
                                    B Read Permissions
                                    A Delete
                                    9 Write Attributes
                                    8 Read Attributes
                                    7 Delete Subfolders and Files
                                    6 Traverse Folder / Execute File
                                    5 Write Extended Attributes
                                    4 Read Extended Attributes
                                    3 Create Folders / Append Data
                                    2 Create Files / Write Data
                                    1 List Folder / Read Data
                       Spec is for "Folder and Subfolders only" and has the
                       same choices as Perm.

   /R user             Revoke specified user's access rights.
                       (Will remove any Allowed or Denied ACL's for user)

   /P user:GUI         Replace security permissions similar to standard choices
   /P user:perm;spec   Replace specified user's access rights.
                       For access right specification see /G option
                       (/P acts like /G if there are no rights set for user)

   /D user:GUI         Deny security permissions similar to standard choices.
   /D user:perm;spec   Deny specified user access rights.
                       For access right specification see /G option
                       (/D adds to existing rights for user)

   /O user             Change the Ownership to this user or group.

   /FO                 Always force an Ownership change using the takeown tool.

   /I switch           Inheritance flag, if omitted default is to not touch
                       Inherited ACL's. Switch can be:
                          ENABLE - This will turn on the Inheritance Flag if
                                   its not on already.
                          COPY   - This will turn off the Inheritance flag and
                                   copy the Inherited ACL's
                                   into Effective ACL's
                          REMOVE - This will turn off the Inheritance flag and
                                   will not copy the Inherited
                                   ACL's, this is the opposite of ENABLE
                       If switch is not present, /I will be ignored and
                       inherited ACL's will remain untouched.

   /SPEC switch        Special Permission for Folder and Subfolders only
                       If this switch is used, and the object is a folder, then
                       one of the switches below would be used instead of the
                       default.
                          A - This Folder Only
                          B - This Folder, Subfolders and Files (Default)
                          C - This Folder and Subfolders
                          D - This Folder and Files
                          E - Subfolders and Files Only
                          F - Subfolders Only
                          G - Files Only

   /L filename         Filename for Logging. This can include a path name
                       if the file isn't under the current directory.
                       File will be appended to, or created if it doesn't
                       exit. Must be Text file if it exists or error will occur.
                       If filename is omitted the default name of XCACLS.log will
                       be used.

   /Q                  Turn on Quiet mode, its off by default.
                       If its turned on, there will be no display to the screen.

   /QQ                 Turn on Semi-Quiet mode: show a '.' dot for every processed item.

   /C                  Ignore errors, its off by default.

   /DEBUG              Turn on Debug mode, its off by default.
                       If its turned on, there will be more information
                       displayed and/or logged. Information will show
                       Sub/Function Enter and Exit as well as other important
                       information.

   /TIMEWMI            Turn on to Time WMI use, only shows up in Debug Mode.

   /SERVER servername  Enter a remote server to run script against.

   /USER username      Enter Username to impersonate for Remote Connections
                            (Requires PASS switch)
                            - Will be ignored if its for a Local Connection.

   /PASS password      Enter Password to go with USER switch
                            (Requires USER switch)


Wildcards can be used to specify more than one file in a command.
Such as:
             *   Any string of zero or more characters
             ?   Any single character

You can specify more than one user in a command.
You can combine access rights.

    