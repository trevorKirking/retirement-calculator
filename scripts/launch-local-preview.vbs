Set shell = CreateObject("WScript.Shell")
shell.CurrentDirectory = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName) & "\.."
shell.Run "cmd.exe /k ""scripts\launch-local-preview.cmd""", 1, False
