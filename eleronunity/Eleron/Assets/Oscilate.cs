using UnityEngine;
using System.Collections;

public class Oscilate : MonoBehaviour
{
	public Vector3 v3TranslateAmplitude;
	public Vector3 v3TranslatePhase;
	public Vector3 v3TranslateFrequency;
	
	public Vector3 v3RotateAmplitude;
	public Vector3 v3RotatePhase;
	public Vector3 v3RotateFrequency;

	Vector3 _mStartPosition;
	Vector3 _mStartRotation;
	Vector3 _mLocalEulerRotation;

	// Use this for initialization
	void Start ()
	{
		_mStartPosition = this.transform.localPosition;
		_mStartRotation = this.transform.localRotation.eulerAngles;
	}

	// Update is called once per frame
	void Update () 
	{
		Vector3 _mLocalPosition = this.transform.localPosition;
		_mLocalPosition.x = _mStartPosition.x + v3TranslateAmplitude.x * Mathf.Sin( Time.time * v3TranslateFrequency.x + v3TranslatePhase.x );
		_mLocalPosition.y = _mStartPosition.y + v3TranslateAmplitude.y * Mathf.Sin( Time.time * v3TranslateFrequency.y + v3TranslatePhase.y );
		_mLocalPosition.z = _mStartPosition.z + v3TranslateAmplitude.z * Mathf.Sin( Time.time * v3TranslateFrequency.z + v3TranslatePhase.z );
		this.transform.localPosition = _mLocalPosition;

		_mLocalEulerRotation.x =  _mStartRotation.x + v3RotateAmplitude.x * Mathf.Sin( Time.time * v3RotateFrequency.x + v3RotatePhase.x );
		_mLocalEulerRotation.y =  _mStartRotation.y + v3RotateAmplitude.y * Mathf.Sin( Time.time * v3RotateFrequency.y + v3RotatePhase.y );
		_mLocalEulerRotation.z =  _mStartRotation.z + v3RotateAmplitude.z * Mathf.Sin( Time.time * v3RotateFrequency.z + v3RotatePhase.z );

		Quaternion _mLocalRotation = this.transform.localRotation;
		_mLocalRotation.eulerAngles = _mLocalEulerRotation;
		this.transform.localRotation = _mLocalRotation;
	}
}
